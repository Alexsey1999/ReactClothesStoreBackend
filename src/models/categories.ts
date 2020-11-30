import mongoose from 'mongoose'

import { Schema } from 'mongoose'

const categorySchema = new Schema({
  id: mongoose.Schema.Types.ObjectId,
  categoryName: {
    type: String,
    required: true,
  },
  products: [{ type: Schema.Types.ObjectId, ref: 'shirt' }],
})

export default categorySchema
