import { DocumentType, post, pre, prop, Ref } from '@typegoose/typegoose'
import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'user/user.entity';

@post<Base>('findOneAndUpdate', function (doc: any, next) {
  const { lastErrorObject: { updatedExisting }, value } = doc
  const base: DocumentType<Base> = value
  const userId = undefined

  const isNew = updatedExisting !== true

  if (isNew && userId !== null) {
    // Set the createdby value
    base.set({ createdBy: userId })
    return base.save({ validateBeforeSave: false })
      .then(() => next())
  }

  if (!isNew && userId !== null) {
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
class Base {
  @Field(() => String, { nullable: true })
  @prop({ ref: () => User, required: false })
  createdBy: Ref<User>

  @Field(() => String, { nullable: true })
  @prop({ ref: () => User, required: false })
  lastUpdatedBy: Ref<User>
}

export default Base