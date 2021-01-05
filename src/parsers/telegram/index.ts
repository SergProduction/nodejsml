import path from 'path'
import { htmlParse } from './html-parser'
import { oneLineLog } from './progress-log'
import { DB, readFiles } from '../../persist'




export async function telegram(rowSampleName: string, sampleName: string) {
  console.log('starting')

  const DIR_ROW_SAMPLE = path.join(__dirname, `../../../data/row-samples/telegram/${rowSampleName}`)

  const db = new DB('samples', sampleName)

  await readFiles(DIR_ROW_SAMPLE, '.html', async (fileString, i, allFiles) => {
    try {
      console.log(allFiles[i]);
      
      const messages = htmlParse(fileString)

      console.log(`file - ${allFiles[i]}. messages in this file - ${messages.length}`)

      await db.insert(messages)

    } catch (err) {
      console.log(`/nerror in file ${i}. ${allFiles[i]}`)

      console.error(err)
    }
  })
  console.log('\nfinished')
}
