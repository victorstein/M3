import { DocumentType, post, pre, prop } from '@typegoose/typegoose'
import { Field, ObjectType } from '@nestjs/graphql'

@post<Base>('findOneAndUpdate', function (doc: any, next) {
  const base: DocumentType<Base> = doc
  const userId = undefined

  if (userId !== undefined) {
    // Set the lastUpdatedBy value
    base.set({ lastUpdatedBy: userId })
    return base.save({ validateBeforeSave: false })
      .then(() => next())
  }

  return next()
})

@pre<Base>('validate', function (next) {
  const userId = undefined

  if (this.isNew && userId !== undefined) {
    this.createdBy = userId
    return next()
  }

  this.lastUpdatedBy = userId
  return next()
})

@ObjectType()
export class Base {
  @Field(() => String, { nullable: true })
  @prop({ required: false })
  createdBy: string

  @Field(() => String, { nullable: true })
  @prop({ required: false })
  lastUpdatedBy?: string
}
