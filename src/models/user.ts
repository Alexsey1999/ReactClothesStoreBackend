import { Schema, model, Document } from 'mongoose'

interface IOrder {
  items: []
  ordertoken: string
  purePrice: number
  deliveryPrice: number
  totalPrice: number
  country: string
  area: string
  address: string
  mailindex: string
  personName: string
  phone: string
  city: string
}

export interface IUser extends Document {
  _id: Schema.Types.ObjectId | unknown
  googleId?: string
  vkId?: string
  email?: string
  password?: string
  orders?: IOrder[]
  firstName?: string
  lastName?: string
  name?: string
  surname?: string
  thirdname?: string
  phone?: string
  country?: string
  city?: string
  area?: string
  address?: string
  mailindex?: string
  note?: string
  resetPasswordToken?: string
  resetPasswordExpires?: Date | number
}

const UserSchema: Schema = new Schema({
  _id: Schema.Types.ObjectId,
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

export default model<IUser>('User', UserSchema)
