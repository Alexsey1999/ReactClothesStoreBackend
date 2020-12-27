import { Router } from 'express'
import homeValidation from '../core/validations/home'
import { HomeController } from '../controllers'

const homeRouter = Router()

homeRouter.post('/question', homeValidation, HomeController.askQuestion)

export default homeRouter
