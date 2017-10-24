import readErrorSchema from "./schemas/read-error";
import writeErrorSchema from "./schemas/write-error";
import canParse from "./can-parse";

const schemas = {
  readErrorSchema,
  writeErrorSchema
};

export { canParse, schemas };
