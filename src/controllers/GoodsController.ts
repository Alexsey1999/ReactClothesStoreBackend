// @ts-nocheck
import express from 'express'
import { model } from 'mongoose'
import GoodsSchema from '../models/goods'
import categorySchema from '../models/categories'

// const shirts = model('shirt', GoodsSchema)
// const caps = model('caps', GoodsSchema)

export const models: any = {
  't-shirts': model('t-shirt', GoodsSchema),
  shirts: model('shirt', GoodsSchema),
  hoodies: model('hoodie', GoodsSchema),
  sweatshirts: model('sweatshirt', GoodsSchema),
  hats: model('hat', GoodsSchema),
  caps: model('cap', GoodsSchema),
  polo: model('polo', GoodsSchema),
  bags: model('bag', GoodsSchema),
  souvenirs: model('souvenir', GoodsSchema),
}

const categoriesModel = model('categorie', categorySchema)

class GoodsController {
  static async getGoodsByCategory(req: express.Request, res: express.Response) {
    try {
      const data = await models[req.params.categoryName].find({
        category: req.params.categoryName,
      })

      console.log(req.params.categoryName)

      res.json(data)
    } catch (error) {
      console.log(error)
    }
  }

  static async getProductById(req: express.Request, res: express.Response) {
    try {
      const category: string = req.query.category as string

      const data = await models[category].findById(req.params.id)

      // const productRecommendations = await GoodsController.getRecommendations(
      //   data._id
      // )

      const response = {
        product: data,
        // recommendations: productRecommendations,
      }

      res.json(response)
    } catch (error) {
      console.log(error)
    }
  }

  static async getRecommendations(productId) {
    try {
      const allCategories = await categoriesModel.find().populate('products')

      const recommendations = allCategories
        .map((el) => {
          switch (el.categoryName) {
            case 'souvenirs':
              return el.products.slice(0, 8)
            case 'hoodies':
              return el.products.slice(0, 4)
            case 'caps':
              return el.products.slice(0, 1)
            case 'shirts':
              return el.products.slice(0, 3)
            case 'bags':
              return el.products.slice(0, 3)
            case 'bags':
              return el.products.slice(0, 2)
            default:
              return []
          }
        })
        .reduce((a, b) => a.concat(b), [])

      return recommendations.filter((product) => product._id != productId)
    } catch (error) {
      console.log(error)
    }
  }
}

export default GoodsController
