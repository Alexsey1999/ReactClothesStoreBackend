import mongoose from 'mongoose'

import { Schema } from 'mongoose'

const GoodsSchema = new Schema({
  id: mongoose.Schema.Types.ObjectId,
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
