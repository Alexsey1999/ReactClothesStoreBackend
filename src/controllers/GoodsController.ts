import { ICategory } from './../models/categories'
import { IGoodsItem } from './../models/goods'
import express from 'express'
import { model } from 'mongoose'
import GoodsSchema from '../models/goods'
import categorySchema from '../models/categories'

export const models: any = {
  't-shirts': model<IGoodsItem>('t-shirt', GoodsSchema),
  shirts: model<IGoodsItem>('shirt', GoodsSchema),
  hoodies: model<IGoodsItem>('hoodie', GoodsSchema),
  sweatshirts: model<IGoodsItem>('sweatshirt', GoodsSchema),
  hats: model<IGoodsItem>('hat', GoodsSchema),
  caps: model<IGoodsItem>('cap', GoodsSchema),
  polo: model<IGoodsItem>('polo', GoodsSchema),
  bags: model<IGoodsItem>('bag', GoodsSchema),
  souvenirs: model<IGoodsItem>('souvenir', GoodsSchema),
}

const categoriesModel = model<ICategory>('categorie', categorySchema)

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

      const productRecommendations = await GoodsController.getRecommendations(
        data._id
      )
      const response = {
        product: data,
        recommendations: productRecommendations,
      }

      res.json(response)
    } catch (error) {
      console.log(error)
    }
  }

  static async getRecommendations(productId: string) {
    try {
      const allCategories = await categoriesModel.find().populate('products')

      const recommendations = allCategories
        .map((el: any) => {
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
            case 't-shirts':
              return el.products.slice(0, 2)
            default:
              return []
          }
        })
        .reduce((a, b) => a.concat(b), [])

      const currentProduct = recommendations.find(
        (product: any) => product._id.toString() == productId.toString()
      )

      if (!currentProduct) {
        return recommendations.slice(0, 20)
      }

      return recommendations.filter(
        (product: any) => product._id.toString() != productId.toString()
      )
    } catch (error) {
      console.log(error)
    }
  }
}

export default GoodsController
