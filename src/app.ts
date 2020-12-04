// Libs
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import passport from 'passport'

// Routes
import { goodsRoute } from './routes'
import { productRoute } from './routes'
import { homeRoute } from './routes'
import { userRoute } from './routes'

// App settings
const app = express()
const PORT = process.env.PORT || 3001
import './core/db'

import './models/user'
import './core/passport'

// Middlewares
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  })
)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  session({
    secret: 'you secret key',
    resave: false,
    saveUninitialized: true,
  })
)
app.use(cookieParser('you secret key'))
app.use(passport.initialize())
app.use(passport.session())

import passportConfig from './core/passport'
passportConfig(passport)

// Requests
app.use('/', homeRoute)
app.use('/user', userRoute)
app.use('/category', goodsRoute)
app.use('/product', productRoute)

app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`)
})
