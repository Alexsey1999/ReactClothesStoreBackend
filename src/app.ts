// Libs
import express from 'express'
import cors from 'cors'

// Routes
import goodsRouter from './routes'

// App settings
const app = express()
const PORT = process.env.PORT || 3001
import './core/db'

// Middlewares
app.use(cors())

// Requests
app.use('/category', goodsRouter)

app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`)
})
