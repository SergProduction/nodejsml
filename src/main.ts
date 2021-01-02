
import { ManyTF, ManyTFData } from './tf'
// import sampleJson from '../sample/prog-langs.json'
import checkSample from './check-sample'
import { persist } from './persist'
import { loadSample, objForEach, objMap } from './lib'


/* to-do
2:30 start
3:15 save to bd and load from bd - 1h
4 add repl
---
30m add effectors files from olimp and marked
30m added one cluster method
1h playnig with weigths. some example math.log10(x*x)
*/


 
const loadManyTF = async (key: string) => {
  const maybeTf = await persist.load<ManyTFData>(key)

  if (maybeTf !== null) {
    return ManyTF.fromObject(maybeTf)
  }

  const fullSample = await loadSample<Record<string, string[]>>('prog-langs')

  const sample = objMap(fullSample, (label, docs) => docs.slice(0, 50))
  
  const tf = new ManyTF()

  objForEach(sample, (label, docs) => {
    tf.addCorpus(label, docs)
  })

  await persist.save(key, tf.toObject())

  return tf
}

const predictManyTF = async (sampleName: string, checkSamples: string[]) => {
  const tf = await loadManyTF(sampleName)

  tf.calcWeigths()

  checkSamples.forEach(doc => {
    const result = tf.predictLabel(doc)
    console.log(result)
  })
}

predictManyTF('langs-raw', checkSample)


// printLabel('Shell')

// exp1: classic obj
// calculate: 40769.242ms
// predict: 2.789ms


// calculate: 26574.327ms