'use strict';
import Repl from 'repl'
import path from 'path'
import { customEval } from './custom-eval'


const historyFile = path.join(__dirname, '../../repl_history')

const helpText  = `
 q                      - выход
 this                   - просмотр глобальных переменных
 _                      - последняя команда
 .editor                - многострочный ввод
 .clear                 - очистить глобал скоуп
 repl                   - инстанс Repl
 repl.repl._builtinLibs - список модулей
 repl.repl.lines        - список введенных команд в текущей сессии
 repl.repl.history      - история введенных команд
`

console.log(helpText);

const defaultGlobalCommandList = [
  'global',
  'clearInterval',
  'clearTimeout',
  'setInterval',
  'setTimeout',
  'queueMicrotask',
  'clearImmediate',
  'setImmediate',
]

const repl = Repl.start({
  prompt: 'tf> ',
  useColors: true,
  // replMode: Repl.REPL_MODE_STRICT,
  // eval: customEval,
});


repl.setupHistory(historyFile, (err, repl) => {
  if (err) throw err
})

defaultGlobalCommandList.forEach(cmd => {
  Object.defineProperty(repl.context, cmd, { enumerable: false })
})


Object.defineProperty(repl.context, 'q', {
  configurable: false,
  enumerable: true,
  get: () => repl.close(),
})


export const defineCommand = (comands: Record<string, any>) => {
  Object.keys(comands).forEach(key => {
    Object.defineProperty(repl.context, key, {
      configurable: false,
      enumerable: true,
      value: comands[key]
    })
  })
}

defineCommand({
  log: console.log,
})

// repl.on('line', newLine =>{});
// repl.on('reset', initializeContext);
