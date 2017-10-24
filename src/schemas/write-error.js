import { root } from "./";
import { any, Match, Skip, Fault } from "chimpanzee";
import { source, composite } from "isotropy-analyzer-utils";

function recurseToParentFromMember(state, analysisState) {
  return composite(
    {
      type: "MemberExpression",
      object: source(() => [root, recurseToParent])(state, analysisState)
    }
  );
}

function recurseToParentFromCall(state, analysisState) {
  return composite(
    {
      type: "CallExpression",
      callee: source(() => [root, recurseToParent])(state, analysisState)
    }
  );
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

export default function(state, analysisState) {
  return composite(
    {
      type: "AssignmentExpression",
      left: recurseToParent(state, analysisState)
    },
    {
      build: obj => () => result =>
        result instanceof Match
          ? new Fault(
              `Unable to parse KeyValueDB write expression. Refer to documentation.`
            )
          : result
    }
  );
}
