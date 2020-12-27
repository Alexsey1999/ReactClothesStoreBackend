import { check } from 'express-validator'

import User from '../../models/user'

export const userRegisterValidation = [
  check('email')
    .not()
    .isEmpty()
    .withMessage('Поле не должно быть пустым')
    .trim()
    .escape()
    .isEmail()
    .withMessage('Неверный формат электронной почты')
    .custom((email) => {
      return User.findOne({ email }).then((user) => {
        if (user) {
          throw new Error('Такое значение поля E-Mail адрес уже существует.')
        }
      })
    })
    .normalizeEmail(),
  check('password')
    .not()
    .isEmpty()
    .withMessage('Поле не должно быть пустым')
    .trim()
    .escape()
    .isLength({ min: 5 })
    .withMessage('Пароль менее 5 символов'),
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
]

export const userLoginValidation = [
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
]

export const resetTokenValidation = [
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
]
