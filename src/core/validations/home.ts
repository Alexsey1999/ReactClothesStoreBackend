import { check } from 'express-validator'

export default [
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
]
