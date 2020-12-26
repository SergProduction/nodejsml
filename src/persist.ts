import path from 'path'
import DB from 'nedb-promises'

// puretf

export class Persist<T> {
  db: DB
  load: Promise<undefined>
  constructor(filename: string) {
    this.db = DB.create({
      filename: path.join(__dirname, `../storage/${filename}`)
    })
    this.load = this.db.load()
  }

  async save(all: T) {
    await this.load
    await this.db.remove({}, { multi: true })
    await this.db.insert(all)
    return true
  }

  async getAll() {
    return this.db.find<T>({}).exec()
  }
}