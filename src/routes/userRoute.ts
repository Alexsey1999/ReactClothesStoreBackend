// @ts-nocheck
import passport from 'passport'
import { Router } from 'express'
import User from '../models/user'
import bcrypt from 'bcrypt'
import { check, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import { checkAuthentication } from '../app'
import { issueToken, passportSettings } from '../core/passport'
import async from 'async'
import nodemailer from 'nodemailer'
import {
  smtpTransport,
  resetPasswordEmailLetter,
  successfullResetPassword,
} from '../core/nodemailer'
import crypto from 'crypto'

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
  (req, res, next) => {
    const { email, password, repeatPassword } = req.body
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    } else {
      passport.authenticate(
        'local-signup',
        {
          successRedirect: '/account',
          failureRedirect: '/login',
        },
        (err, user, info) => {
          if (err) {
            throw err
          }

          if (!user) {
            return res.json({ errorMessage: info })
          }

          req.logIn(user, (err) => {
            if (err) {
              throw err
            }

            const token = jwt.sign({ user }, 'TOP_SECRET')

            return res.json({ user, token })
          })
        }
      )(req, res, next)
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
        'local-signin',
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

              if (req.body.rememberme) {
                req.session.cookie.originalMaxAge = 604800000 * 100
              } else {
                req.session.cookie.originalMaxAge = 48 * 60 * 60 * 1000
              }

              const token = jwt.sign({ user }, 'TOP_SECRET')

              return res.json({ user, token })
            })
          }
        }
      )(req, res, next)
    }
  }
)

userRoute.post('/update', (req, res) => {
  const { id, fieldValue, field } = req.body

  User.updateOne({ _id: id }, { [field]: fieldValue }, (err, result) => {
    if (err) {
      throw err
    }

    res.json({
      message: 'Данные заказа были успешно обновлены.',
      user: req.user,
    })
  })
})

userRoute.post('/resetpassword', (req, res) => {
  async.waterfall([
    function (done) {
      crypto.randomBytes(20, function (err, buf) {
        const token = buf.toString('hex')
        done(err, token)
      })
    },

    function (token, done) {
      User.findOne({ email: req.body.email }, function (err, user) {
        if (!user) {
          return res.json('Пользователя с данным email не существует')
        }

        user.resetPasswordToken = token
        user.resetPasswordExpires = Date.now() + 3600000 // 1 hour

        user.save(function (err) {
          done(err, token, user)
        })
      })
    },

    function (token, user, done) {
      smtpTransport.sendMail(
        resetPasswordEmailLetter(user.email, req.headers.host, token),
        (err, info) => {
          if (err) {
            res.json(
              `Не удалось отправить письмо с восстановлениме пароля на адрес ${user.email}`
            )
            return
          }
          console.log(info)
        }
      )
    },
  ])
})

userRoute.get('/reset/:token', function (req, res) {
  User.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    },
    function (err, user) {
      if (!user) {
        return res.json(
          'Токен восстановления пароля невалиден или срок его действия истечен'
        )
      }
      res.render('reset', {
        user: req.user,
      })
    }
  )
})

userRoute.post(
  '/reset/:token',
  check('password')
    .not()
    .isEmpty()
    .withMessage('Поле не должно быть пустым')
    .trim()
    .escape()
    .isLength({ min: 5 })
    .withMessage('Не менее 5 символов'),
  check('confirm')
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
  (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    User.findOne(
      {
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() },
      },
      async function (err, user) {
        if (err) {
          throw err
        }

        if (!user) {
          return res.json(
            'Токен восстановления пароля невалиден или срок его действия истечен'
          )
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        user.password = hashedPassword
        user.resetPasswordToken = undefined
        user.resetPasswordExpires = undefined

        user.save(function (err) {
          req.logIn(user, function (err) {
            res.redirect('http://localhost:3000/')
          })
        })

        smtpTransport.sendMail(
          successfullResetPassword(user.email),
          (err, info) => {
            if (err) {
              throw err
            }
            res.json('Вы успешно обновили пароль')
          }
        )
      }
    )
  }
)

userRoute.get('/logout', checkAuthentication, (req, res) => {
  req.logOut()
  res.json('User logged out')
})

userRoute.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile'],
  })
)

userRoute.get('/', (req, res) => {
  res.json(req.user)
})

userRoute.get(
  '/google/callback',
  passport.authenticate('google'),
  (req, res) => {
    res.redirect(`http://localhost:3000/?googleauth=${req.user.googleId}`)
  }
)

export default userRoute
