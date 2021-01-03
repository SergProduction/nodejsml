import { defineCommand } from './configure-repl'

import { TF, GroupTF } from '../models'

defineCommand({
  tf: new TF(),
  groupTf: new GroupTF()
})
