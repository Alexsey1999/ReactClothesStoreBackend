import mongoose from 'mongoose'

import { Schema } from 'mongoose'

const categorySchema = new Schema({
  id: Schema.Types.ObjectId,
  categoryName: {
    type: String,
    required: true,
  },
  products: [{ type: Schema.Types.ObjectId, refPath: 'onModel' }],

  onModel: {
    type: String,
    required: true,
    enum: ['shirt', 'cap', 't-shirt', 'bag', 'polo'],
  },
})

export default categorySchema
