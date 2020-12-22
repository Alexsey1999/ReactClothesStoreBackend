// @ts-nocheck
import { Router } from 'express'
import userModel from '../models/user'
import { checkAuthentication } from '../app'

const accountRouter = Router()

accountRouter.post('/persondata', checkAuthentication, (req, res) => {
  const { name, surname, thirdname, phone } = req.body

  userModel.updateOne(
    { _id: req.user._id },
    {
      name,
      surname,
      thirdname,
      phone,
    },
    (err, result) => {
      if (err) {
        throw err
      }

      res.json({
        successMessage: 'Ваши данные были успешно сохранены.',
      })
    }
  )
})

accountRouter.post('/addressdata', checkAuthentication, (req, res) => {
  const { country, city, area, address, mailindex } = req.body
  userModel.updateOne(
    { _id: req.user._id },
    {
      country,
      city,
      area,
      address,
      mailindex,
    },
    (err, result) => {
      if (err) {
        throw err
      }
      res.json({
        successMessage: 'Ваши данные были успешно сохранены.',
      })
    }
  )
})

accountRouter.get('/settings', checkAuthentication, (req, res) => {
  res.json(req.user)
})

export default accountRouter
