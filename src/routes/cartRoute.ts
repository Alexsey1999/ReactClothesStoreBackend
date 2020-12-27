import { Router } from 'express'
import { CartController } from '../controllers'

const cartRouter = Router()

cartRouter.post('/add/:productId', CartController.addProductItemToCart)

cartRouter.post('/remove/:productId', CartController.removeProductItemFromCart)

cartRouter.post('/reduce/:productId', CartController.reduceProductItem)

cartRouter.post('/increase/:productId', CartController.increaseProductItem)

cartRouter.post('/size/:productId', CartController.chooseProductItemSize)

cartRouter.get('/items', CartController.getProductItemFromCart)

cartRouter.get('/clear', CartController.clearCart)

export default cartRouter
