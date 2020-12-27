import { Router } from 'express'
import { checkAuthentication } from '../app'
import { AccountController } from '../controllers'

const accountRouter = Router()

accountRouter.post(
  '/persondata',
  checkAuthentication,
  AccountController.updatePersonData
)

accountRouter.post(
  '/addressdata',
  checkAuthentication,
  AccountController.updatePersonAddressData
)

accountRouter.get(
  '/settings',
  checkAuthentication,
  AccountController.getUserSettings
)

export default accountRouter
