// Strategies
import VKontakteStrategy from './strategies/vk'
import GoogleStrategy from './strategies/google'
import LocalStrategySignIn from './strategies/localSignIn'
import LocalStrategySignUp from './strategies/localSignUp'

// Models
import User from '../models/user'

// Interfaces
import { PassportStatic } from 'passport'
import { IUser } from '../models/user'

export default (passport: PassportStatic) => {
  passport.use(VKontakteStrategy)
  passport.use('local-signin', LocalStrategySignIn)
  passport.use('local-signup', LocalStrategySignUp)
  passport.use(GoogleStrategy)

  passport.serializeUser((user: IUser, cb) => {
    cb(null, user._id)
  })

  passport.deserializeUser((id, cb) => {
    User.findOne({ _id: id }, (err, user) => {
      cb(err, user)
    })
  })
}
