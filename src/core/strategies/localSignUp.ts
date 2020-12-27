import LocalStrategy from 'passport-local'
import bcrypt from 'bcrypt'

import User from '../../models/user'

export default new LocalStrategy.Strategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  (email, password, done) => {
    User.findOne({ email }, async (err, user) => {
      if (err) {
        throw err
      }
      if (user) {
        return done(null, false, {
          message: 'Пользователь с таким email уже существует',
        })
      }
      if (!user) {
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
          email,
          password: hashedPassword,
        })

        await newUser.save()

        return done(null, newUser)
      }
    })
  }
)
