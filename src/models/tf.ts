import { Counter } from '../data-lib'
import { Model } from '../model'


export type CalcWeigthDoc = (count: number, len: number) => number
export type CalcWeigthCorpus = (count: number, len: number, docsLen: number) => number

/*
TF - Term Frequence
вычисляет частоту термов для каждого документа и для корпуса
*/

export type TF_IO_Data = {
  docs: Record<string, number>[]
  corpus: Record<string, number>
}

export class TF extends Model<TF_IO_Data> {
  handleCalcDoc: CalcWeigthDoc
  handleCalcCorpus: CalcWeigthCorpus
  docs: Counter[]
  corpus: Counter
  
  constructor(tfDocs?: Counter[], tfCorpus?:Counter) {
    super()
    this.handleCalcDoc = (count, len) => count
    this.handleCalcCorpus = (count, len) => count
    this.docs = tfDocs || []
    this.corpus = tfCorpus || new Counter()
  }

  // чтоб можжно было переопределить метод getTerms, взять отсюда регулярку
  static typeTerms = {
    code: /(\w+|&|!|=|<|>|{|}|\[|\]|\(|\)|\+|-|@|\$|\*|\/|\?|"|'|,|;)/,
    text: /(\w+|[а-я]+)/
  }

  getTerms(doc: string, typeTerms?: RegExp): string[] {
    const regexp = typeTerms ? typeTerms : TF.typeTerms.text

    return doc
      .split(regexp)
      .filter(t =>
          t !== ''
          && /\d+/.test(t) === false
          && /^\s+$/.test(t) === false
      )
      .map(t => {
        if (t.indexOf('$') === 0) {
          return '/$'
        }
        if (t.indexOf('.') !== -1) {
          return t.split('').map(w => w === '.' ? '^' : w).join('')
        }
        return t
      })
/*
      .reduce<string[]>((acc, it) => {
        const last = acc[acc.length-1]
        const ngramm = last.length < 3
          ? last + it
          : it
        acc.push(ngramm)
        return acc
      }, [''])
*/
  }

  decode(modelData: TF_IO_Data) {
    this.docs = modelData.docs.map(d => new Counter(d))
    this.corpus = new Counter(modelData.corpus)
    // return new TF(docs, corpus)
  }

  encode() {
    return {
      docs: this.docs.map(v => v.toObject()),
      corpus: this.corpus.toObject(),
    }
  }

  addCorpus(corpus: string[]) {
    corpus.forEach(doc => this.addDoc(doc))
  }

  addDoc(doc: string) {
    const terms = this.getTerms(doc)
    const tfDoc = Counter.fromArray(terms)
    this.docs.push(tfDoc)
    this.corpus.extend(tfDoc)
  }

  learn(handleCalcDoc?: CalcWeigthDoc, handleCalcCorpus?: CalcWeigthCorpus, isImmutable?: boolean) {
    const calcWeigthDoc = handleCalcDoc || this.handleCalcDoc
    const calcWeigthCorpus = handleCalcCorpus || this.handleCalcCorpus

    const newTfDocs = this.docs.map(
      doc => doc.map(
        (key, count, len) => calcWeigthDoc(count, len)
      )
    )
    const rawTfCorpus = newTfDocs.reduce(
      (corpus, doc) => corpus.extend(doc),
      new Counter()
    )
    const newTfCorpus = rawTfCorpus.map((key, count, len) => calcWeigthCorpus(count, len, this.docs.length))
    
    if (isImmutable) {
      const newTF = new TF(newTfDocs, newTfCorpus)
      newTF.handleCalcDoc = calcWeigthDoc
      newTF.handleCalcCorpus = calcWeigthCorpus
      return newTF
    }
    this.docs = newTfDocs
    this.corpus = newTfCorpus
  }

  predict(doc: string) {
    console.error('еще нету этой фичи');
  }
}
