import { Counter, sum } from './lib'

// --- parse weigth ---

const getTokens = (doc: string): string[] => {
  return doc.split(/\s+/);
}


type CalcFn = (count: number, len: number) => number

const calcWeightDoc: CalcFn = (count, len) => 1
const calcWeightCorpus: CalcFn = (count, len) => count

const calcDocCounter = (doc: string): Counter => {
  const tokens = getTokens(doc);
  const freqTok = Counter.fromArray(tokens)
  return freqTok.map((key, count, len) => calcWeightDoc(count, len))
}

const calcCorpusCounter = (docsCounter: Counter[]): Counter => {
  const corpusCounter = docsCounter.reduce((acc, counter) => acc.merge(counter), new Counter())
  return corpusCounter.map((key, count, len) => calcWeightCorpus(count, len))
}

export class LabledCorpus {
  state: {[label: string]: {
    docLen: number,
    corpusCounter: Counter
  }}
  normalized: {
    label: string
    corpusCounter: Counter
  }[]
  constructor() {
    this.state = {}
    this.normalized = []
  }

  push(label: string, corpus: string[]) {
    const newCorpusCounter = calcCorpusCounter(corpus.map(calcDocCounter))
    if (!this.state.hasOwnProperty(label)) {
      this.state[label] = {
        docLen: 0,
        corpusCounter: new Counter()
      }
    }
    let { docLen, corpusCounter } = this.state[label]
    this.state[label].docLen = docLen + corpus.length
    this.state[label].corpusCounter = corpusCounter.merge(newCorpusCounter)
  }

  scalleByDocLen(label: string) {
    let { docLen, corpusCounter } = this.state[label]
    return corpusCounter.map((_, count) => count / docLen)
  }

  normalize() {
    this.normalized = Object.keys(this.state)
      .map(label => ({
        label,
        corpusCounter: this.scalleByDocLen(label)
      }))
  }

  predictLabel(doc: string) {
    const docTokens = getTokens(doc)

    const result = this.normalized.map(({ label, corpusCounter }) => ({
      label,
      weight: sum(
        docTokens.map(word => corpusCounter.count(word))
      )
    })).sort((a, b) => b.weight - a.weight)

    console.log(result)
  }

  debugLog(doc: string) {}
}
