import format from 'dateformat'
import colors from 'colors/safe'

export const log = (content = [], color = 'white') => {
  if (!Array.isArray(content)) {
    content = [ content ]
  }
  const time = format(Date.now(), 'mm/dd HH:MM:ss')
  const log = [
    colors.gray(time),
    '|',
    ...content.map((str) => colors[color](str))
  ]
  console.log(...log)
  return log
}

export const success = (...content) => log(content, 'green')
export const warn = (...content) => log(content, 'yellow')
export const error = (...content) => log(content, 'red')
export const info = (...content) => log(content, 'cyan')
