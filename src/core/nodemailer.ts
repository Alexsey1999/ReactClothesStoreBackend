import nodemailer from 'nodemailer'

export const smtpTransport = nodemailer.createTransport({
  host: 'smtp.mail.ru',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export const resetPasswordEmailLetter = (
  to: string,
  headers: string,
  token: string
) => ({
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

export const successfullResetPassword = (to: string) => ({
  to: to,
  from: '<shoshov-999@mail.ru>',
  subject: 'Вы успешно обновили пароль',
  text:
    'Привет,\n\n' +
    'Ваш запрос на изменение пароля аккаунта' +
    to +
    ' успешно состоялся. Теперь вы можете зайти в аккаунт с новым паролем\n',
})

export const questionLetter = (
  from: string,
  message: string,
  name: string
) => ({
  to: '<shoshov-999@mail.ru>',
  from: '<shoshov-999@mail.ru>',
  subject: 'Jollybellclone question',
  text: message + ' ' + name + ' ' + from,
})
