// @ts-nocheck
import { Router } from 'express'
import randtoken from 'rand-token'

const bookingRoute = Router()

bookingRoute.get('/', (req, res) => {
  const orderToken = randtoken.generate(24)
  req.session.ordertoken = orderToken

  res.json(orderToken)
})

bookingRoute.post('/checktoken', (req, res) => {
  const { orderid } = req.body

  if (req.session.ordertoken === orderid) {
    return res.json(req.session.ordertoken)
  }

  res.json(false)
})

export default bookingRoute
