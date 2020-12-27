import { Router } from 'express'
import { GoodsController } from '../controllers'

const goodsRouter = Router()

goodsRouter.get('/:categoryName', GoodsController.getGoodsByCategory)

export default goodsRouter
