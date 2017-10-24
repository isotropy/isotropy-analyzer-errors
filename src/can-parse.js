export default function canParse(schema, obj) {
  const result = parse(schema)(obj)();
  return result instanceof Match || result instanceof Empty;
}