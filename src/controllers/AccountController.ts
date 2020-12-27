import { Request, Response } from 'express'

import userModel from '../models/user'

class AccountController {
  static updatePersonData(req: Request, res: Response) {
    const { name, surname, thirdname, phone } = req.body

    userModel.updateOne(
      { _id: req.user!._id },
      {
        name,
        surname,
        thirdname,
        phone,
      },
      (err, result) => {
        if (err) {
          throw err
        }

        res.json({
          successMessage: 'Ваши данные были успешно сохранены.',
        })
      }
    )
  }

  static updatePersonAddressData(req: Request, res: Response) {
    const { country, city, area, address, mailindex } = req.body

    userModel.updateOne(
      { _id: req.user._id },
      {
        country,
        city,
        area,
        address,
        mailindex,
      },
      (err, result) => {
        if (err) {
          throw err
        }
        res.json({
          successMessage: 'Ваши данные были успешно сохранены.',
        })
      }
    )
  }

  static getUserSettings(req: Request, res: Response) {
    res.json(req.user)
  }
}

export default AccountController
