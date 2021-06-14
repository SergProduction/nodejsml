import { defineCommand } from './configure-repl'

import * as models from '../models'
import * as parse from '../parsers'
import * as features from '../features'
import { DB } from '../persist'



defineCommand({
  DB: DB,
  models,
  parse,
  features
})
