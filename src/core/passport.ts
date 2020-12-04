// @ts-nocheck
import LocalStrategy from 'passport-local'
import User from '../models/user'
import bcrypt from 'bcrypt'

export default (passport) => {
  passport.use(
    new LocalStrategy.Strategy(
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
          bcrypt.compare(password, user.password, (err, result) => {
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
  )

  passport.serializeUser((user, cb) => {
    cb(null, user._id)
  })

  passport.deserializeUser((id, cb) => {
    User.findOne({ _id: id }, (err, user) => {
      cb(err, user)
    })
  })
}
