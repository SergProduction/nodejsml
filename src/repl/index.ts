import { defineCommand } from './configure-repl'

import { persist } from '../persist'

defineCommand({
  p: persist
})
