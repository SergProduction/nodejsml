
import path from 'path'
import fs from 'fs'
import { promisify } from 'util'

import { persist } from '../persist'

import { FILE } from '../constants'


/*
model - обученная модель с вычисленными весами
sample - обучающая выборка
checkSamples - проверочная выборка

При первой загрузки модели (model.load),
модель вычислит веса на основе выборки (sample)
после вычисления сохранит веса в файл,
при последующих загрузках (model.load),
ранее вычисленные веса загрузятся из файла.
Можно перезаписать веса,
для этого надо передать модель с новыми весами в метод model.save
*/


const loadSample = async <T>(sampleName: string): Promise<T> => {
  const fileBuffer = await promisify(fs.readFile)(FILE.SAMPLE(sampleName))
  const fileString = fileBuffer.toString()
  return JSON.parse(fileString)
}

export abstract class Model<ModelData, RowData> {
  abstract decode(modelData: ModelData): void
  abstract encode(): ModelData
  abstract setSample(rowData: RowData): void
  abstract learn(activateFn: any): any
  abstract predict(p: any): any
  async load(sampleName: string, modelName: string) {
    const maybeModelData = await persist.load<ModelData>(modelName)

    if (maybeModelData !== null) {
      return this.decode(maybeModelData)
    }
  
    const sample = await loadSample<RowData>(sampleName)
  
    this.setSample(sample)
  
    await this.save(modelName)
  }
  async save(modelName: string) {
    await persist.save(modelName, this.encode())
  }
}
