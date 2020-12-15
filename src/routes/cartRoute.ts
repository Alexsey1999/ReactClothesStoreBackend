// @ts-nocheck
import { Router } from 'express'
import Cart from '../models/cart'
import { models } from '../controllers/GoodsController'

const cartRouter = Router()

cartRouter.post('/add/:productId', (req, res) => {
  const { productSize, productQuantity } = req.body
  const productId = req.params.productId
  const category = req.query.category

  const cart = new Cart(req.session.cart ? req.session.cart : {})

  models[category].findById(productId, (err, product) => {
    if (err) {
      throw err
    }
    cart.add(product, product._id, productSize, productQuantity)
    req.session.cart = cart

    console.log(req.session.cart)

    res.json({ cart: { ...req.session.cart, items: cart.items } })
  })
})

cartRouter.post('/remove/:productId', (req, res) => {
  const productId = req.params.productId
  const { productIndex, productSize } = req.body
  const cart = new Cart(req.session.cart ? req.session.cart : {})

  cart.removeItem(productId, productIndex, productSize)
  req.session.cart = cart

  console.log(req.session.cart)

  res.json({ cart: { ...req.session.cart, items: cart.items } })
})

cartRouter.post('/reduce/:productId', (req, res) => {
  const productId = req.params.productId
  const { productSize } = req.body
  const cart = new Cart(req.session.cart ? req.session.cart : {})

  cart.reduceByOne(productId, productSize)
  req.session.cart = cart

  console.log(req.session.cart)

  res.json({ cart: { ...req.session.cart, items: cart.items } })
})

cartRouter.post('/increase/:productId', (req, res) => {
  const productId = req.params.productId
  const { productSize } = req.body
  const cart = new Cart(req.session.cart ? req.session.cart : {})

  cart.increaseByOne(productId, productSize)
  req.session.cart = cart

  console.log(req.session.cart)

  res.json({ cart: { ...req.session.cart, items: cart.items } })
})

cartRouter.post('/size/:productId', (req, res) => {
  const { size, productIndex } = req.body
  const productId = req.params.productId
  const cart = new Cart(req.session.cart ? req.session.cart : {})

  cart.setSize(productId, size, productIndex)
  req.session.cart = cart

  console.log(req.session.cart)
  res.json({ cart: { ...req.session.cart, items: cart.items } })
})

export default cartRouter