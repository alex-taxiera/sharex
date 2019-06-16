export function classname (...classes) {
  return classes.filter((x) => x).join(' ')
}
