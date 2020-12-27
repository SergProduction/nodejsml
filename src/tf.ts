import { Counter, sum } from './lib'

type CalcWeigthDoc = (count: number, len: number) => number
type CalcWeigthCorpus = (count: number, len: number, docsLen: number) => number


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
  static getTerms(doc: string): string[] {
    return doc.split(/\s+/)
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

export class ManyTF {
  state: Record<string, TF>
  handleCalcDoc: CalcWeigthDoc
  handleCalcCorpus: CalcWeigthCorpus

  constructor(initState?: Record<string, TF>) {
    this.state = {}
    this.handleCalcDoc = () => 1
    this.handleCalcCorpus = (count, len, docLen) => count / docLen
  }

  addCorpus(label: string, corpus: string[]) {
    if (!this.state[label]) {
      this.state[label] = new TF()
    }
    this.state[label].addCorpus(corpus)
  }

  calcWeigths(handleCalcDoc?: CalcWeigthDoc, handleCalcCorpus?: CalcWeigthCorpus, isImmutable?: boolean) {
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
  }

  predictLabel(doc: string) {
    const docTerms = TF.getTerms(doc)

    const docWeigthsByCorpus = Object.keys(this.state).map(label => ({
      label,
      weights: docTerms.map(term => this.state[label].corpus.count(term))
    }))

    const tryPredict = docWeigthsByCorpus.map(t => ({
      label: t.label,
      weight: sum(t.weights)
    })).sort((a, b) => b.weight - a.weight)

    return tryPredict
  }
}

