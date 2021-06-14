import path from 'path'
import { GroupTF } from '../models/group-tf'
import { Sample } from '../sample'
import { readJSONFile } from '../persist'


type RowData = Record<string, string[]>


export class LangsProg extends GroupTF implements Sample<RowData> {
  async loadSample(sampleName: string) {
    const sample = await readJSONFile<{}>(path.join(__dirname, '../data/samples/', sampleName))
    this.addGroup(sample)
  }
}

