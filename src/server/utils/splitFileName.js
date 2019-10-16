export function splitFileName (fileName) {
  const all = fileName.split('.')
  const ext = all.pop()
  return [ all.join('.'), ext ]
}
