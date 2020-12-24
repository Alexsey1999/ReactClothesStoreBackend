// @ts-nocheck
import { questionLetter } from './../core/nodemailer'
import { Router } from 'express'
import { check, validationResult } from 'express-validator'
import { smtpTransport } from '../core/nodemailer'

// import GoodsController from '../controllers/GoodsController'
const homeRouter = Router()

homeRouter.get('/', (req, res) => {
  console.log(req.session)
  res.send('hello')
})

homeRouter.post(
  '/question',
  [
    check('name')
      .not()
      .isEmpty()
      .withMessage('Поле не должно быть пустым')
      .trim()
      .escape(),
    check('email')
      .not()
      .isEmpty()
      .withMessage('Поле не должно быть пустым')
      .trim()
      .escape()
      .isEmail()
      .withMessage('Неверный формат электронной почты'),
    check('message')
      .not()
      .isEmpty()
      .withMessage('Поле не должно быть пустым')
      .trim()
      .escape()
      .isLength({ min: 10 })
      .withMessage('Сообщение менее 10 символов')
      .isLength({ max: 250 })
      .withMessage('Сообщение более 250 символов'),
  ],
  (req, res) => {
    if (!req.user) {
      return res.json({ errorMessage: 'Вы не зарегестрированы' })
    }
    const { name, email, message } = req.body

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    } else {
      smtpTransport.sendMail(
        questionLetter(email, message, name),
        (err, info) => {
          if (err) {
            throw err
          }
          res.json({ successMessage: 'Сообщение успешно отправлено' })
        }
      )
    }
  }
)

export default homeRouter
