import Repl from 'repl'
import { Context } from 'vm'



const transform = (code: string) => {
  const tokens = code.split(/\s+/).slice(1, -1)
  return tokens.reduceRight((acc, t) => {
    if (acc === '') {
      return t
    }
    return t + `(${acc})`
  }, '')
}

const isCustomEval = (cmd: string) => cmd[0] === '/'

export function customEval (
  cmd: string,
  context: Context,
  filename: string,
  callback: (err: null, cmd: string) => void
) {
  if (isCustomEval(cmd)) {
    callback(null, eval(transform(cmd)))
  }
  else {
    callback(null, eval(cmd))
  }
}

