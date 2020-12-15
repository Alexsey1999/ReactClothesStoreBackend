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
  name: { type: String },
  surname: { type: String },
  thirdname: { type: String },
  phone: { type: String },
  country: { type: String },
  city: { type: String },
  area: { type: String },
  address: { type: String },
  mailindex: { type: String },
})

export default model('User', UserSchema)
