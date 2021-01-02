import path from 'path'
import DB from 'nedb-promises'
import fs from 'fs'
import { promisify } from 'util'



// puretf

/*
TF = {
  cluster: Record<word, number>,
  docs: Record<word, number>[],
}
allRow.json TF[]
langs.json Record<word,TF[]>
*/



export const persist = {
  _keys: undefined as void | string[],
  DIR: path.join(__dirname, `../storage/`),
  FILE: function(filename: string) {
    return this.DIR + filename + '.json'
  },
  keys: async function () {
    if (this._keys !== undefined) {
      return this._keys
    }
    const files = await promisify(fs.readdir)(this.DIR)
    this._keys = files.map(f => path.basename(f, '.json'))
    return this._keys 
    
  },
  isKey: async function(key: string) {
    const keys = await this.keys()
    const isExists = keys.some(k => k === key)
    return isExists
  },
  save: async function<T>(key: string, data: T) {
    const db = DB.create({
      filename: this.FILE(key)
    })
    
    await db.remove({}, { multi: true })
    
    return db.insert(data)
  },
  load: async function<T>(key: string) {
    const isExist = await this.isKey(key)
    if (isExist === false) return null

    const db = DB.create({
      filename: this.FILE(key)
    })

    const result = await db.find<T>({}).exec()
    const firts = result[0]

    return firts as any as T
  }
}
