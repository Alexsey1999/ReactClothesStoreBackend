// Libs
import express from 'express'
import cors from 'cors'

const app = express()

// Middlewares
app.use(cors())

const PORT = process.env.PORT || 3001

import './core/db'

app.get('/category/:categoryName', (req, res) => {
  res.json('dssss')
})

app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`)
})
