import { any, Match, Skip, Fault, wrap } from "chimpanzee";
import { source, composite } from "isotropy-analyzer-utils";

export default function(root) {
  function recurseToParentFromMember(state, analysisState) {
    return composite({
      type: "MemberExpression",
      object: source(() => [root, recurseToParent])(state, analysisState)
    });
  }

  function recurseToParentFromCall(state, analysisState) {
    return composite({
      type: "CallExpression",
      callee: source(() => [root, recurseToParent])(state, analysisState)
    });
  }

  function recurseToParent(state, analysisState) {
    return any(
      [
        recurseToParentFromMember(state, analysisState),
        recurseToParentFromCall(state, analysisState)
      ],
      { selector: "path" }
    );
  }

  return function(state, analysisState) {
    return wrap(recurseToParent(state, analysisState), {
      build: obj => () => result =>
        result instanceof Match
          ? new Fault(
              `Unable to parse KeyValueDB read expression. Refer to documentation.`
            )
          : result
    });
  };
}
