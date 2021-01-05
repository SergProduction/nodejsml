import { LOADIPHLPAPI } from 'dns'
import { Counter } from '../data-lib'
import { Model } from '../model'


type IO_Model_Data = [string[], number][]

export class NGramm extends Model<IO_Model_Data> {
  n: number
  model: Counter
  private separator: string

  constructor(n?: number) {
    super()
    this.n = n || 2
    this.model = new Counter()
    this.separator = '➕'
  }

  static toNGramm(rowData: string[], n:number) {
    const allRowNGramm = []

    for(let i=0; i<rowData.length; i++) {
      const ngramm = rowData.slice(i, i+n)
      if (ngramm.length < n) continue
      allRowNGramm.push(ngramm)
    }

    return allRowNGramm
  }

  encode() {
    const arrJoinedNGrmam = this.model.toArray(true)

    const output = arrJoinedNGrmam.map(([joinedNGrmam, count]) => [
      joinedNGrmam.split(this.separator),
      count
    ]) as IO_Model_Data

    return output
  }

  decode(modelData: IO_Model_Data) {
    this.model = Counter.fromArray(
      modelData.map(ngramm => ngramm.join(this.separator))
    )
  }

  getTerms(doc: string): string[] {
    return doc
      .split(/([а-я]+)/i)
      .filter(t =>
        t !== ''
        && t.length > 2
        && /\d+/.test(t) === false
        && /^\s+$/.test(t) === false
      )
      .map(word => word.toLowerCase())
  }


  addNramm(rowData: string) {
    const terms = this.getTerms(rowData)
    const f = NGramm.toNGramm(terms, this.n)
    // console.log();
    const counterNgramm = Counter.fromArray(
      f.map(ngramm => ngramm.join(this.separator))
    )
    this.model.extend(counterNgramm)
  }

  learn() {}
  predict() {}
}