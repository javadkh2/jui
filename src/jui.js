export function element(type, ...args) {
  console.log(type, args);
  return `component->${type}`;
}
