// @ts-nocheck
import UserSchema from '../models/user'
import { Schema, model } from 'mongoose'

const UserSchema = new Schema({
  id: Schema.Types.ObjectId,
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
})

export default model('User', UserSchema)
