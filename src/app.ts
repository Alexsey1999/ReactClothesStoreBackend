// @ts-nocheck
// Libs
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import connectMongo from 'connect-mongo'
import mongoose from 'mongoose'

// Routes
import { goodsRoute } from './routes'
import { productRoute } from './routes'
import { homeRoute } from './routes'
import { userRoute } from './routes'
import { cartRoute } from './routes'
import { accountRoute } from './routes'

// App settings
const app = express()
const PORT = process.env.PORT || 3001
import './core/db'

import './models/user'
import './core/passport'
const MongoStore = connectMongo(session)

// Middlewares
app.use(cookieParser())
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
    proxy: true,
    secret: 'you secret key',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000, secure: false },
  })
)

app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  res.locals.session = req.session
  next()
})

import passportConfig from './core/passport'
passportConfig(passport)

// function ensureAuthenticated(req, res, next){
//   if(req.isAuthenticated()) {
//     return next()
//   } else {
//     res.redirect('/')
//   }
// }

// Requests
app.use('/', homeRoute)
app.use('/cart', cartRoute)
app.use('/user', userRoute)
app.use('/category', goodsRoute)
app.use('/product', productRoute)
app.use('/account', accountRoute)

app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`)
})
