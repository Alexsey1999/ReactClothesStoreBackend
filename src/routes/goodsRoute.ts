import { Router } from 'express'

import GoodsController from '../controllers/GoodsController'

const goodsRouter = Router()

// const GoodsControlles = new GoodsController('shirt')

goodsRouter.get('/:categoryName', GoodsController.getGoodsByCategory)

export default goodsRouter
