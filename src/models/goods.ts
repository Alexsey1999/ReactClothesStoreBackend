import { Schema, Document } from 'mongoose'

export interface IGoodsItem extends Document {
  id: Schema.Types.ObjectId
  name: string
  price: number
  imageUrl: number
  category: string
  isBlack?: boolean
  isWhite?: boolean
  swiperImages: string[]
  deliveryInfo: string
  description: object
  sizeAndCare: object
  sizes: object[]
  delivery: number
}

const GoodsSchema: Schema = new Schema({
  id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  isBlack: {
    type: Boolean,
  },
  isWhite: {
    type: Boolean,
  },
  swiperImages: {
    type: [String],
    required: true,
  },
  deliveryInfo: {
    type: String,
    required: true,
  },
  description: {
    type: [Object],
    required: true,
  },
  sizeAndCare: {
    type: Object,
    required: true,
  },
  sizes: {
    type: [Object],
    required: true,
  },
  delivery: Number,
})

export default GoodsSchema
