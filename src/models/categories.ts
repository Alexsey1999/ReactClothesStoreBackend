import { Schema, Document } from 'mongoose'

export interface ICategory extends Document {
  id: Schema.Types.ObjectId
  categoryName: string
  products: Schema.Types.ObjectId[]
  onModel: 'shirt' | 'cap' | 't-shirt' | 'bag' | 'polo'
}

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
