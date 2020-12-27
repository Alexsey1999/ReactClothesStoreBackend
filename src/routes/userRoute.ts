import {
  userRegisterValidation,
  userLoginValidation,
  resetTokenValidation,
} from './../core/validations/user'
import passport from 'passport'
import { Router } from 'express'
import { checkAuthentication } from '../app'
import { UserController } from '../controllers'

const userRoute = Router()

userRoute.post('/register', userRegisterValidation, UserController.registerUser)

userRoute.post('/login', userLoginValidation, UserController.loginUser)

userRoute.post('/update', UserController.updateUser)

userRoute.post('/resetpassword', UserController.resetPassword)

userRoute.get('/reset/:token', UserController.resetTokenGet)

userRoute.post(
  '/reset/:token',
  resetTokenValidation,
  UserController.resetTokenPost
)

userRoute.get('/logout', checkAuthentication, UserController.logoutUser)

userRoute.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile'],
  })
)

userRoute.get('/', UserController.getUser)

userRoute.get(
  '/google/callback',
  passport.authenticate('google'),
  UserController.googleCallback
)

userRoute.get('/vkontakte', passport.authenticate('vkontakte'))

userRoute.get(
  '/vkontakte/callback',
  passport.authenticate('vkontakte', {
    failureRedirect: '/login',
  }),
  UserController.vkCallback
)

export default userRoute
