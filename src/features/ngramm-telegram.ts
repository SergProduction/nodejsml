import { NGramm } from '../models/n-gramm'
import { Sample } from '../sample'
import { DB } from '../persist'
import { Message } from '../parsers/telegram/html-parser'
import { Counter } from '../data-lib'


export class TelegramNGramm extends NGramm implements Sample<Message[]> {
  async loadSample(sampleName: string) {
    const db = new DB<Message>('samples', sampleName)
    const maybeSampleData = await db.getAll()
    const onlyTextDocs = maybeSampleData.map(mess => mess.text)
    this.model = new Counter()
    for(let i=0; i<onlyTextDocs.length; i++) {
      const doc = onlyTextDocs[i]
      this.addNramm(doc)
    }
  }
}

