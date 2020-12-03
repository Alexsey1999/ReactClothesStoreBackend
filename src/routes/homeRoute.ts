import { Router } from 'express'

// import GoodsController from '../controllers/GoodsController'

const homeRouter = Router()

homeRouter.get('/', (req, res) => {
  console.log(123)
})

homeRouter.post('/register', (req, res) => {
  console.log('register')
})

homeRouter.post('/login', (req, res) => {
  console.log('login')
})

export default homeRouter
