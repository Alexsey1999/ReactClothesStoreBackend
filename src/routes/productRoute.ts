import { Router } from 'express'
import GoodsController from '../controllers/GoodsController'

const productRouter = Router()

productRouter.get('/:id', GoodsController.getProductById)

export default productRouter
