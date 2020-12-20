// @ts-nocheck
import { Router } from 'express'
import randtoken from 'rand-token'
import Stripe from 'stripe'
import User from '../models/user'

const stripe = new Stripe(
  'sk_test_51Hzfg4EWaRj0TMbRxoWHGuqs71l9wq1DBSnKkpy9OSIArU6G5dQ9Zxkxj7dZJYlEK76EIPc07Vb55I1DVK3aL7z800jYRvcyyH'
)

const bookingRoute = Router()

bookingRoute.get('/', (req, res) => {
  const orderToken = randtoken.generate(24)
  req.session.ordertoken = orderToken

  if (!req.session.cart.items.length) {
    return res.json({
      message: 'Вы не можете перейти к оформлению заказа т.к. корзина пуста.',
    })
  }

  res.json(orderToken)
})

bookingRoute.post('/checktoken', (req, res) => {
  const { orderid } = req.body

  if (req.session.ordertoken === orderid) {
    return res.json(req.session.ordertoken)
  }

  res.json(false)
})

bookingRoute.post('/payment', async (req, res) => {
  const { amount, description } = req.body

  const descriptionInfo = Object.values(description).join(' ')

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'RUB',
    description: descriptionInfo,
  })

  res.json({
    clientSecret: paymentIntent.client_secret,
  })
})

bookingRoute.post('/addorder', (req, res) => {
  const { cart, user, ordertoken, description } = req.body

  User.findOneAndUpdate(
    { _id: user._id },
    {
      $push: {
        orders: {
          items: cart.items,
          totalPrice: cart.totalPrice,
          purePrice: cart.purePrice,
          deliveryPrice: cart.deliveryPrice,
          country: description.country,
          area: description.area,
          address: description.address,
          mailindex: description.mailindex,
          personName: description.name,
          phone: description.phone,
          city: description.city,
          ordertoken,
        },
      },
    },
    (err, user) => {
      if (err) {
        throw err
      }

      res.json('Заказ успешно добавлен')
    }
  )
})

export default bookingRoute
