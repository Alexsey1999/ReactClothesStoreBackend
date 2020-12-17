// @ts-nocheck
import { Router } from 'express'

// import GoodsController from '../controllers/GoodsController'
const homeRouter = Router()

homeRouter.get('/', (req, res) => {
  console.log(req.session)
  res.send('hello')
})

export default homeRouter
