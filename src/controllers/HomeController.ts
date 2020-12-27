import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { questionLetter } from './../core/nodemailer'
import { smtpTransport } from '../core/nodemailer'

class HomeController {
  static askQuestion(req: Request, res: Response) {
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
}

export default HomeController
