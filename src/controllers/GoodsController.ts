// @ts-nocheck
import express from 'express'
import { model } from 'mongoose'
import GoodsSchema from '../models/goods'
import categorySchema from '../models/categories'

// const shirts = model('shirt', GoodsSchema)
// const caps = model('caps', GoodsSchema)

const models: any = {
  shirts: model('shirt', GoodsSchema),
  caps: model('cap', GoodsSchema),
}

const categoriesModel = model('categorie', categorySchema)

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
    GoodsController.getRecomendations()
    // try {
    //   const category: string = req.query.category as string
    //   const data = await models[category].findById(req.params.id)
    //   res.json(data)
    // } catch (error) {
    //   console.log(error)
    // }
    res.json('done')
  }

  static async getRecomendations() {
    try {
      // const allModals = Object.entries(models)
      // const recomendations = allModals.map(([modelName, model]) => {
      //   if (modelName === 'shirts') {
      //     return model.find((err, doc) => {
      //       return doc
      //     })
      //     // .limit(6)
      //   }
      //   // return await model.find().limit(2)
      // })
      const categories = await categoriesModel.find().populate('products')
      // new categoriesModel({
      //   categoryName: 'Test2',
      //   products: ['5fc4f5bbddbb5019bccb4305'],
      // }).save()
      console.log(categories[categories.length - 1]['products'])
    } catch (error) {
      console.log(error)
    }
  }
}

export default GoodsController
