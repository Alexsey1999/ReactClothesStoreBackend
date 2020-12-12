// @ts-nocheck
import passport from 'passport'
import { Router } from 'express'
import User from '../models/user'
import bcrypt from 'bcrypt'
import { check, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'

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

userRoute.post(
  '/login',
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
  ],
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    } else {
      passport.authenticate(
        'local',
        {
          successRedirect: '/account',
          failureRedirect: '/login',
        },
        (err, user, info) => {
          if (err) {
            throw err
          }
          if (!user) {
            return res.status(404).json('No User Exists')
          } else {
            req.logIn(user, (err) => {
              if (err) {
                throw err
              }

              const token = jwt.sign({ user }, 'TOP_SECRET')

              return res.json({ token })

              // res.json('Successfully Authenticated')
            })
          }
        }
      )(req, res, next)
    }
  }
)

userRoute.get('/logout', (req, res) => {
  req.session.destroy(function () {
    res.clearCookie('connect.sid')
    res.redirect('/')
  })
})

export default userRoute
