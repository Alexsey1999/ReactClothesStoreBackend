// @ts-nocheck
import UserSchema from '../models/user'
import { Schema, model } from 'mongoose'

const UserSchema = new Schema({
  id: Schema.Types.ObjectId,
  googleId: String,
  vkId: String,
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  orders: [
    {
      items: Array,
      ordertoken: String,
      purePrice: Number,
      deliveryPrice: Number,
      totalPrice: Number,
      country: String,
      area: String,
      address: String,
      mailindex: String,
      personName: String,
      phone: String,
      city: String,
    },
  ],
  name: { type: String },
  surname: { type: String },
  thirdname: { type: String },
  phone: { type: String },
  country: { type: String },
  city: { type: String },
  area: { type: String },
  address: { type: String },
  mailindex: { type: String },
  note: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
})

export default model('User', UserSchema)
