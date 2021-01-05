import { TF } from '../models/tf'
import { Sample } from '../sample'
import { DB } from '../persist'
import { Message } from '../parsers/telegram/html-parser'


export class TelegramTF extends TF implements Sample<Message[]> {
  async loadSample(sampleName: string) {
    const db = new DB<Message>('samples', sampleName)
    const maybeSampleData = await db.getAll()
    const onlyText = maybeSampleData.map(mess => mess.text)
    this.addCorpus(onlyText)
  }
}

