import { IUser } from './../../../frontend/src/interfaces/user'
import { NextFunction, Request, Response } from 'express'
import passport from 'passport'
import { validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import User from '../models/user'
import async from 'async'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import {
  smtpTransport,
  resetPasswordEmailLetter,
  successfullResetPassword,
} from '../core/nodemailer'

class UserController {
  static registerUser(req: Request, res: Response, next: NextFunction) {
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

  static loginUser(req: Request, res: Response, next: NextFunction) {
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

              if (req.body.rememberme === 'true') {
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

  static updateUser(req: Request, res: Response) {
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
  }

  static resetPassword(req: Request, res: Response) {
    async.waterfall([
      function (done: any) {
        crypto.randomBytes(20, function (err: any, buf: any) {
          const token = buf.toString('hex')
          done(err, token)
        })
      },

      function (token: string, done: any) {
        User.findOne({ email: req.body.email }, function (err, user) {
          if (!user) {
            return res.json({
              errorMessage: 'Пользователя с данным email не существует',
            })
          }

          user.resetPasswordToken = token
          user.resetPasswordExpires = Date.now() + 3600000 // 1 hour

          user.save(function (err) {
            done(err, token, user)
          })

          res.json({
            successMessage: 'Ссылка на сброс пароля была отправлена!',
          })
        })
      },

      function (token: string, user: IUser, done: any) {
        smtpTransport.sendMail(
          resetPasswordEmailLetter(user.email!, req.headers.host!, token),
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
  }

  static resetTokenGet(req: Request, res: Response) {
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
  }

  static resetTokenPost(req: Request, res: Response) {
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
          successfullResetPassword(user.email!),
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

  static logoutUser(req: Request, res: Response) {
    req.logOut()
    res.json('User logged out')
  }

  static getUser(req: Request, res: Response) {
    res.json(req.user)
  }

  static googleCallback(req: Request, res: Response) {
    res.redirect(`http://localhost:3000/?googleauth=${req.user.googleId}`)
  }

  static vkCallback(req: Request, res: Response) {
    res.redirect(`http://localhost:3000/?vkauth=${req.user.vkId}`)
  }
}

export default UserController
