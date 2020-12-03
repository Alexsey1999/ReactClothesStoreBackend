// Libs
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import session from 'express-session'
import cookieParser from 'cookie-parser'

// Routes
import { goodsRoute } from './routes'
import { productRoute } from './routes'
import { homeRoute } from './routes'

// App settings
const app = express()
const PORT = process.env.PORT || 3001
import './core/db'

// Middlewares
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000'],
    optionsSuccessStatus: 200,
  })
)
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  session({
    secret: 'you secret key',
    resave: false,
    saveUninitialized: true,
  })
)

// Requests
app.use('/', homeRoute)
app.use('/category', goodsRoute)
app.use('/product', productRoute)

app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`)
})
