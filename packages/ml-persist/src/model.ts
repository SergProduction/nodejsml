import { DB } from './persist'


export abstract class Model<ModelData> {
  // из базы в модель
  abstract decode(modelData: ModelData): void
  // из модели в базу
  abstract encode(): ModelData
  abstract learn(activateFn: any): any
  abstract predict(p: any): any
  async loadModel(modelName: string) {
    const db = new DB<ModelData>('models', modelName)
    const maybeModelData = await db.getFist()
    if (maybeModelData !== null) {
      return this.decode(maybeModelData)
    }
    console.log(`data model ${modelName} not found`)
  }
  async saveModel(modelName: string) {
    const db = new DB<ModelData>('models', modelName)
    return await db.insert(this.encode())
  }
}


