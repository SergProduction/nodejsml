import path from 'path'
import NEDB from 'nedb-promises'
import fs from 'fs'
import { promisify } from 'util'


export class DB<T> {
  db: NEDB
  filePath: string

  constructor(scope: string, tableName: string) {
    this.filePath = path.join(__dirname, '../data', scope, tableName + '.json')
    this.db = NEDB.create({
      filename: this.filePath
    })
  }

  async insert(data: T | T[]) {
    await this.db.insert(data)
  }

  async getAll(): Promise<T[]> {
    const result = await this.db.find<T>({})
    return result.map(r => {
      const { _id, createdAt, updatedAt, ...data } = r
      return data as any as T
    })
  }

  async getFist(): Promise<T> {
    const result = await this.db.find<T>({})
    const { _id, createdAt, updatedAt, ...data } = result[0]
    return data as any as T
  }
}


export const readFileString = async (fileName: string) => {
  const fileBuffer = await promisify(fs.readFile)(fileName)
  return fileBuffer.toString()
}

export const readFiles = async (
  dirName: string,
  ext: string,
  cb: (file: string, i: number, all: string[]) => Promise<any>
) => {
  const files = fs
    .readdirSync(dirName)
    .filter(fileOrDir => path.parse(fileOrDir).ext === ext)

  for (let i = 0; i < 2; i++) {
    const fileName = files[i]
    const fileString = await readFileString(path.join(dirName, fileName))
    await cb(fileString, i, files)
  }
}


export const readJSONFile = async <T>(filePath: string): Promise<T> => {
  const fileString = await readFileString(filePath)
  return JSON.parse(fileString)
}
