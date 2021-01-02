import { Counter, sum, objMap } from './lib'

type CalcWeigthDoc = (count: number, len: number) => number
type CalcWeigthCorpus = (count: number, len: number, docsLen: number) => number

export type TFData = {
  docs: Record<string, number>[]
  corpus: Record<string, number>
}

export class TF {
  handleCalcDoc: CalcWeigthDoc
  handleCalcCorpus: CalcWeigthCorpus
  docs: Counter[]
  corpus: Counter
  
  constructor(tfDocs?: Counter[], tfCorpus?:Counter) {
    this.handleCalcDoc = (count, len) => count
    this.handleCalcCorpus = (count, len) => count
    this.docs = tfDocs || []
    this.corpus = tfCorpus || new Counter()
  }

  static fromObject(data: TFData) {
    const docs = data.docs.map(d => new Counter(d))
    const corpus = new Counter(data.corpus)
    return new TF(docs, corpus)
  }

  toObject() {
    return {
      docs: this.docs.map(v => v.toObject()),
      corpus: this.corpus.toObject(),
    }
  }

  static getTerms(doc: string): string[] {
    // const regexp = /\s+/
    // const regexp = /(\w+)/
    const regexp = /(\w+|&|!|=|<|>|{|}|\[|\]|\(|\)|\+|-|@|\$|\*|\/|\?|"|'|,|;)/
    // const f = ['=','<','>','{','}', '(', ')', '[', ']']
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
      .reduce<string[]>((acc, it) => {
        const last = acc[acc.length-1]
        const ngramm = last.length < 3
          ? last + it
          : it
        acc.push(ngramm)
        return acc
      }, [''])
  }

  addCorpus(corpus: string[]) {
    corpus.forEach(doc => this.addDoc(doc))
  }

  addDoc(doc: string) {
    const terms = TF.getTerms(doc)
    const tfDoc = Counter.fromArray(terms)
    this.docs.push(tfDoc)
    this.corpus.extend(tfDoc)
  }

  calcWeigths(handleCalcDoc?: CalcWeigthDoc, handleCalcCorpus?: CalcWeigthCorpus, isImmutable?: boolean) {
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
}

export type ManyTFData = Record<string, TFData>

export class ManyTF {
  state: Record<string, TF>
  handleCalcDoc: CalcWeigthDoc
  handleCalcCorpus: CalcWeigthCorpus
  log: boolean

  constructor(initState?: Record<string, TF>) {
    this.state = initState || {}
    this.handleCalcDoc = () => 1
    this.handleCalcCorpus = (count, len, docLen) => count / docLen
    this.log = false
  }

  static fromObject(data: ManyTFData) {
    const result = objMap(data, (label, tfData) => TF.fromObject(tfData))
    return new ManyTF(result)
  }

  toObject() {
    return objMap(this.state, (k, v) => v.toObject())
  }

  addCorpus(label: string, corpus: string[]) {
    if (this.log) console.time(`addCorpus ${label}`)

    if (!this.state[label]) {
      this.state[label] = new TF()
    }
    this.state[label].addCorpus(corpus)

    if (this.log) console.timeEnd(`addCorpus ${label}`)
  }

  calcWeigths(handleCalcDoc?: CalcWeigthDoc, handleCalcCorpus?: CalcWeigthCorpus, isImmutable?: boolean) {
    if (this.log) console.time('calcWeigths')

    const calcDoc = handleCalcDoc || this.handleCalcDoc
    const calcCorpus = handleCalcCorpus || this.handleCalcCorpus

    const newManyTf: Record<string, TF> = Object.keys(this.state).reduce((acc, label) => {
      const tf = this.state[label]
      const newTf = tf.calcWeigths(calcDoc, calcCorpus, true)
      return { ...acc, [label]: newTf }
    }, {})

    if (isImmutable) {
      const newManyTF = new ManyTF(newManyTf)
      newManyTF.handleCalcDoc = calcDoc
      newManyTF.handleCalcCorpus = calcCorpus
      return newManyTF
    }

    this.state = newManyTf

    if (this.log) console.timeEnd('calcWeigths')
  }

  predictLabel(doc: string) {
    if (this.log) console.time('predictLabel')

    const docTerms = TF.getTerms(doc)

    const docWeigthsByCorpus = Object.keys(this.state).map(label => ({
      label,
      weights: docTerms.map(term => this.state[label].corpus.count(term))
    }))

    const tryPredict = docWeigthsByCorpus.map(t => ({
      label: t.label,
      weight: sum(t.weights)
    })).sort((a, b) => b.weight - a.weight)

    if (this.log) console.timeEnd('predictLabel')

    return tryPredict
  }
}

