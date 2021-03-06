import { Logger } from '@nestjs/common'
import { DocumentType } from '@typegoose/typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { FilterQuery, ObjectId, UpdateQuery } from 'mongoose'

export abstract class Service<T> {
  abstract readonly model: ModelType<T>
  abstract readonly logger: Logger

  async create (data: Partial<T>): Promise<DocumentType<T>> {
    this.logger.debug(`Operation: create.\n Data: ${JSON.stringify(data, null, 2)}`)
    return await this.model.create(data)
  }

  async findById (id: ObjectId | string): Promise<DocumentType<T> | null> {
    this.logger.debug(`Operation: findById.\n Id: ${String(id)}`)
    return await this.model.findById(id)
  }

  async find (): Promise<Array<DocumentType<T>> | []> {
    this.logger.debug('Operation: find.')
    return await this.model.find()
  }

  async findOneByParam (filter: FilterQuery<DocumentType<T>>): Promise<DocumentType<T> | null> {
    this.logger.debug(`Operation: findByParam.\n filterQuery: ${JSON.stringify(filter, null, 2)}`)
    return await this.model.findOne(filter)
  }

  async updateOneById (id: String | string, data: UpdateQuery<DocumentType<T>>): Promise<DocumentType<T> | null> {
    this.logger.debug(`Operation: updateOneById.\n Id: ${String(id)}. \n Data: ${JSON.stringify(data, null, 2)}`)
    return await this.model.findByIdAndUpdate(id, data, { new: true })
  }

  async deleteOneById (id: ObjectId | string): Promise<void> {
    this.logger.debug(`Operation: deleteOneById.\n Id: ${String(id)}`)
    await this.model.findByIdAndDelete(id)
  }

  async upsertById (id: ObjectId | string, data: UpdateQuery<DocumentType<T>>): Promise<DocumentType<T>> {
    this.logger.debug(`Operation: upsertById.\n Id: ${String(id)}. \n Data: ${JSON.stringify(data, null, 2)}`)
    const { value } = await this.model.findByIdAndUpdate(id, data, { upsert: true, rawResult: true, new: true })
    return value as DocumentType<T>
  }

  async upsertByParam (filter: FilterQuery<DocumentType<T>>, data: UpdateQuery<DocumentType<T>>): Promise<DocumentType<T>> {
    this.logger.debug(`Operation: upsertByParam.\n filterQuery: ${JSON.stringify(filter, null, 2)}. \n Data: ${JSON.stringify(data, null, 2)}`)
    const { value } = await this.model.findOneAndUpdate(filter, data, { upsert: true, rawResult: true, new: true })
    return value as DocumentType<T>
  }
}
