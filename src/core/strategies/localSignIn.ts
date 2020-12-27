import LocalStrategy from 'passport-local'
import bcrypt from 'bcrypt'

import User from '../../models/user'

export default new LocalStrategy.Strategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  (email, password, done) => {
    User.findOne({ email }, (err, user) => {
      if (err) {
        throw err
      }
      if (!user) {
        return done(null, false)
      }
      bcrypt.compare(password, user.password!, (err, result) => {
        if (err) {
          throw err
        }
        if (result === true) {
          return done(null, user)
        } else {
          return done(null, false)
        }
      })
    })
  }
)
