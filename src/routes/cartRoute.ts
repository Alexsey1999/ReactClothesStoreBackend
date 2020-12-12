// @ts-nocheck
import { Router } from 'express'
import Cart from '../models/cart'
import { models } from '../controllers/GoodsController'

const cartRouter = Router()

cartRouter.get('/add/:productId', (req, res) => {
  const productId = req.params.productId
  const category = req.query.category

  const cart = new Cart(req.session.cart ? req.session.cart : {})

  models[category].findById(productId, (err, product) => {
    if (err) {
      throw err
    }
    cart.add(product, product._id)
    req.session.cart = cart

    console.log(req.session.cart)

    res.json({ cart: { ...req.session.cart, items: cart.generateArray() } })
  })
})

cartRouter.get('/remove/:productId', (req, res) => {
  const productId = req.params.productId
  const cart = new Cart(req.session.cart ? req.session.cart : {})

  cart.removeItem(productId)
  req.session.cart = cart

  console.log(req.session.cart)

  res.json({ cart: { ...req.session.cart, items: cart.generateArray() } })
})

cartRouter.get('/reduce/:productId', (req, res) => {
  const productId = req.params.productId
  const cart = new Cart(req.session.cart ? req.session.cart : {})

  cart.reduceByOne(productId)
  req.session.cart = cart

  res.json({ cart: { ...req.session.cart, items: cart.generateArray() } })
})

cartRouter.get('/increase/:productId', (req, res) => {
  const productId = req.params.productId
  const cart = new Cart(req.session.cart ? req.session.cart : {})

  cart.increaseByOne(productId)
  req.session.cart = cart

  res.json({ cart: { ...req.session.cart, items: cart.generateArray() } })
})

export default cartRouter
