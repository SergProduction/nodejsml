import path from 'path'
import DB from 'nedb-promises'
import fs from 'fs'
import { promisify } from 'util'

import { DIR, FILE } from './constants'


export const persist = {
  _keys: undefined as void | string[],
  keys: async function () {
    if (this._keys !== undefined) {
      return this._keys
    }
    const files = await promisify(fs.readdir)(DIR.MODEL)
    this._keys = files.map(filename => path.basename(filename, FILE.EXT))
    return this._keys 
    
  },
  isKey: async function(key: string) {
    const keys = await this.keys()
    const isExists = keys.some(k => k === key)
    return isExists
  },
  save: async function<T>(key: string, data: T) {
    const db = DB.create({
      filename: FILE.MODEL(key)
    })
    
    await db.remove({}, { multi: true })
    
    return db.insert(data)
  },
  load: async function<T>(key: string): Promise<null | T> {
    const isExist = await this.isKey(key)
    if (isExist === false) return null

    const db = DB.create({
      filename: FILE.MODEL(key)
    })

    const result = await db.find<T>({})
    const { _id, createdAt, updatedAt, ...data } = result[0]
    return data as any as T
  }
}
