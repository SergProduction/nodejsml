import { ManyTF } from './tf'
import sampleJson from '../sample/prog-langs.json'
import checkSample from './check-sample'




const sliceDoc = (data: Record<string, string[]>, count: number) => (
  Object.fromEntries(
    Object.entries(data).map(([label, corpus]) => ([
      label,
      corpus.length > count ? corpus.slice(0, count) : corpus
    ]))
  )
)

const main = () => {  
  const json = sliceDoc(sampleJson, 50)

  const labels = Object.keys(json)
  
  const parser = new ManyTF()

  console.time('calculate')
  labels.forEach((label, i) => {
    console.log(`label: ${label}, docs:${json[label].length}`)
    parser.addCorpus(label, json[label])
    console.log(`all:${labels.length}, i:${i}`)
  })
  console.timeEnd('calculate')

  parser.calcWeigths()

  checkSample.forEach(doc => {
    console.time('predict')
    const result = parser.predictLabel(doc)
    console.log(result)
    console.timeEnd('predict')
  })

}

const printLabel = (label: string) => {
  const json = sliceDoc(sampleJson, 5)
  console.log(json[label])
}

main()

// printLabel('Shell')

// exp1: classic obj
// calculate: 40769.242ms
// predict: 2.789ms


// calculate: 26574.327ms