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
    try {
      const data = await models[req.params.categoryName].find({
        category: req.params.categoryName,
      })

      res.json(data)
    } catch (error) {
      console.log(error)
    }
  }

  static async getProductById(req: express.Request, res: express.Response) {
    try {
      const category: string = req.query.category as string
      const data = await models[category].findById(req.params.id)
      res.json(data)
    } catch (error) {
      console.log(error)
    }
  }
}

export default GoodsController
