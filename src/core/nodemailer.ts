// @ts-nocheck
import nodemailer from 'nodemailer'

export const smtpTransport = nodemailer.createTransport({
  host: 'smtp.mail.ru',
  port: 465,
  secure: true,
  auth: {
    user: 'shoshov-999@mail.ru',
    pass: '300740500vk',
  },
})

export const resetPasswordEmailLetter = (to, headers, token) => ({
  to: to,
  from: '<shoshov-999@mail.ru>',
  subject: 'Восстановление пароля на сайте jollybellclone',
  text:
    'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
    'http://' +
    headers +
    '/user/reset/' +
    token +
    '\n\n' +
    'If you did not request this, please ignore this email and your password will remain unchanged.\n',
})

export const successfullResetPassword = (to) => ({
  to: to,
  from: '<shoshov-999@mail.ru>',
  subject: 'Вы успешно обновили пароль',
  text:
    'Привет,\n\n' +
    'Ваш запрос на изменение пароля аккаунта' +
    to +
    ' успешно состоялся. Теперь вы можете зайти в аккаунт с новым паролем\n',
})

export const questionLetter = (from, message, name) => ({
  to: '<shoshov-999@mail.ru>',
  from: '<shoshov-999@mail.ru>',
  subject: 'Jollybellclone question',
  text: message + ' ' + name + ' ' + from,
})
