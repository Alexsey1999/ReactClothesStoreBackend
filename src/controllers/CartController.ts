import { Request, Response } from 'express'
import { models } from '../controllers/GoodsController'
import Cart from '../models/cart'
import { IGoodsItem } from '../models/goods'

class CartController {
  static addProductItemToCart(req: Request, res: Response) {
    const { productSize, productQuantity } = req.body
    const productId = req.params.productId
    const category: string = req.query.category as string

    const cart: any = new Cart(req.session.cart ? req.session.cart : {})

    models[category].findById(productId, (err: Error, product: IGoodsItem) => {
      if (err) {
        throw err
      }

      cart.add(product, product._id, productSize, productQuantity)
      req.session.cart = cart

      res.json({
        cart: { ...req.session.cart, items: cart.items },
        message: 'Товар успешно добавлен в корзину',
      })
    })
  }

  static removeProductItemFromCart(req: Request, res: Response) {
    const productId = req.params.productId
    const { productIndex, productSize } = req.body
    const cart: any = new Cart(req.session.cart ? req.session.cart : {})

    cart.removeItem(productId, productIndex, productSize)
    req.session.cart = cart

    res.json({
      cart: { ...req.session.cart, items: cart.items },
      message: 'Вы успешно удалили товар из корзины.',
    })
  }

  static reduceProductItem(req: Request, res: Response) {
    const productId = req.params.productId
    const { productSize } = req.body
    const cart: any = new Cart(req.session.cart ? req.session.cart : {})

    const errorMessage = cart.reduceByOne(productId, productSize)
    req.session.cart = cart

    if (errorMessage) {
      return res.json({
        cart: { ...req.session.cart, items: cart.items },
        errorMessage: 'Ожидаемое количество является недопустимым',
      })
    }

    res.json({
      cart: { ...req.session.cart, items: cart.items },
      message: 'Данные у товара в корзине успешно обновлены',
    })
  }

  static increaseProductItem(req: Request, res: Response) {
    const productId = req.params.productId
    const { productSize } = req.body
    const cart: any = new Cart(req.session.cart ? req.session.cart : {})

    cart.increaseByOne(productId, productSize)
    req.session.cart = cart

    res.json({
      cart: { ...req.session.cart, items: cart.items },
      message: 'Данные у товара в корзине успешно обновлены',
    })
  }

  static chooseProductItemSize(req: Request, res: Response) {
    const { size, productIndex } = req.body
    const productId = req.params.productId
    const cart: any = new Cart(req.session.cart ? req.session.cart : {})

    if (req.session.cart.items[productIndex].size === size.size) {
      return res.json({ errorMessage: 'Сейчас уже выбран данный размер.' })
    }

    cart.setSize(productId, size, productIndex)
    req.session.cart = cart

    res.json({
      cart: { ...req.session.cart, items: cart.items },
      message: 'Данные у товара в корзине успешно обновлены',
    })
  }

  static getProductItemFromCart(req: Request, res: Response) {
    res.json(req.session.cart)
  }

  static clearCart(req: Request, res: Response) {
    delete req.session.cart
    res.json('Корзина очищена')
  }
}

export default CartController
