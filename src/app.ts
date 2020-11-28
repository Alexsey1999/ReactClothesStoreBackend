// Libs
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

// Routes
import { goodsRoute } from './routes'
import { productRoute } from './routes'

// App settings
const app = express()
const PORT = process.env.PORT || 3001
import './core/db'

// Middlewares
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Requests
app.use('/category', goodsRoute)
app.use('/product', productRoute)

app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`)
})
