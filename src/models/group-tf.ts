import { sum, objMap, objForEach } from '../data-lib'
import { Model } from '../model'
import {
  TF,
  TF_IO_Data,
  CalcWeigthCorpus,
  CalcWeigthDoc
} from './tf'


/*
GroupTF
*/

type GroupTF_IO_Data = Record<string, TF_IO_Data>

export class GroupTF extends Model<GroupTF_IO_Data> {
  state: Record<string, TF>
  handleCalcDoc: CalcWeigthDoc
  handleCalcCorpus: CalcWeigthCorpus
  log: boolean

  constructor(initState?: Record<string, TF>) {
    super()
    this.state = initState || {}
    this.handleCalcDoc = () => 1
    this.handleCalcCorpus = (count, len, docLen) => count / docLen
    this.log = false
  }

  decode(data: GroupTF_IO_Data) {
    // console.log(data);
    this.state = objMap(data, (label, tfData) => {
      const tf = new TF()
      tf.decode(tfData)
      return tf
    })
  }

  encode(): GroupTF_IO_Data {
    return objMap(this.state, (k, v) => v.encode())
  }

  addGroup(rowData: Record<string, string[]>) {
    objForEach(rowData, (label, corpus) => this.addCorpus(label, corpus))
  }

  addCorpus(label: string, corpus: string[]) {
    if (this.log) console.time(`addCorpus ${label}`)

    if (!this.state[label]) {
      this.state[label] = new TF()
    }
    this.state[label].addCorpus(corpus)

    if (this.log) console.timeEnd(`addCorpus ${label}`)
  }

  learn(handleCalcDoc?: CalcWeigthDoc, handleCalcCorpus?: CalcWeigthCorpus, isImmutable?: boolean) {
    if (this.log) console.time('calcWeigths')

    const calcDoc = handleCalcDoc || this.handleCalcDoc
    const calcCorpus = handleCalcCorpus || this.handleCalcCorpus

    const newGroupTf: Record<string, TF> = Object.keys(this.state).reduce((acc, label) => {
      const tf = this.state[label]
      const newTf = tf.learn(calcDoc, calcCorpus, true)
      return { ...acc, [label]: newTf }
    }, {})

    if (isImmutable) {
      const newGroupTF = new GroupTF(newGroupTf)
      newGroupTF.handleCalcDoc = calcDoc
      newGroupTF.handleCalcCorpus = calcCorpus
      return newGroupTF
    }

    this.state = newGroupTf

    if (this.log) console.timeEnd('calcWeigths')
  }

  predict(doc: string) {
    if (this.log) console.time('predictLabel')

    const docTerms = (new TF).getTerms(doc)

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

