// @ts-nocheck
import passport from 'passport'
import { Router } from 'express'
import User from '../models/user'
import bcrypt from 'bcrypt'
import { check, validationResult } from 'express-validator'

const userRoute = Router()

userRoute.post(
  '/register',
  [
    check('email')
      .not()
      .isEmpty()
      .withMessage('Поле не должно быть пустым')
      .trim()
      .escape()
      .isEmail()
      .withMessage('Неверный формат электронной почты')
      .normalizeEmail(),
    check('password')
      .not()
      .isEmpty()
      .withMessage('Поле не должно быть пустым')
      .trim()
      .escape()
      .isLength({ min: 5 })
      .withMessage('Не менее 5 символов'),
    check('repeatPassword')
      .not()
      .isEmpty()
      .withMessage('Поле не должно быть пустым')
      .trim()
      .escape()
      .custom(async (confirmPassword, { req }) => {
        const password = req.body.password

        if (password !== confirmPassword) {
          throw new Error('Пароли не совпадают')
        }
      }),
  ],
  (req, res) => {
    const { email, password, repeatPassword } = req.body
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    } else {
      User.findOne({ email }, async (err, doc) => {
        if (err) {
          throw err
        }
        if (doc) {
          res.json('User already exists')
        }
        if (!doc) {
          const hashedPassword = await bcrypt.hash(password, 10)

          const newUser = new User({
            email,
            password: hashedPassword,
          })

          await newUser.save()
          res.json('User created')
        }
      })
    }
  }
)

userRoute.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      throw err
    }
    if (!user) {
      res.json('No User Exists')
    } else {
      req.logIn(user, (err) => {
        if (err) {
          throw err
        }
        res.json('Successfully Authenticated')
      })
    }
  })(req, res, next)
})

export default userRoute
