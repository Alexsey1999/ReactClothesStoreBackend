import express from 'express'
import { model } from 'mongoose'
import GoodsSchema from '../models/goods'

// const shirts = model('shirt', GoodsSchema)
// const caps = model('caps', GoodsSchema)

const models: any = {
  shirts: model('shirt', GoodsSchema),
  caps: model('cap', GoodsSchema),
}

class GoodsController {
  static async getGoodsByCategory(req: express.Request, res: express.Response) {
    const data = await models[req.params.categoryName].find({
      category: req.params.categoryName,
    })

    console.log(data)
  }
}

export default GoodsController
