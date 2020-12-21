// @ts-nocheck
import LocalStrategy from 'passport-local'
import RememberMeStrategy from 'passport-remember-me'
import User from '../models/user'
import bcrypt from 'bcrypt'
import { Strategy as JWTstrategy, ExtractJwt } from 'passport-jwt'
import GoogleStrategy from 'passport-google-oauth20'
import { randomString } from '../utils'
import VKontakteStrategy from 'passport-vkontakte'

let tokens = {}

function consumeRememberMeToken(token, fn) {
  let uid = tokens[token]
  // invalidate the single-use token
  delete tokens[token]
  return fn(null, uid)
}

function saveRememberMeToken(token, uid, fn) {
  tokens[token] = uid
  return fn()
}

export function issueToken(user, done) {
  var token = randomString(64)
  saveRememberMeToken(token, user.id, function (err) {
    if (err) {
      return done(err)
    }
    return done(null, token)
  })
}

export default (passport) => {
  passport.use(
    new VKontakteStrategy.Strategy(
      {
        clientID: '7706005',
        clientSecret: 'g2pheeOvxDhiGUQXqniB',
        callbackURL: 'http://localhost:3001/user/vkontakte/callback',
      },
      function (accessToken, refreshToken, params, profile, done) {
        User.findOne({ vkId: profile.id }, (err, user) => {
          if (err) {
            throw err
          }

          if (user) {
            done(null, user)
          } else {
            new User({
              vkId: profile.id,
              name: profile.name.givenName,
            })
              .save()
              .then((vkUser) => {
                done(null, vkUser)
              })
          }
        })
      }
    )
  )

  passport.use(
    'local-signin',
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
  passport.use(
    'local-signup',
    new LocalStrategy.Strategy(
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
            return done(
              null,
              false,
              'Пользователь с таким email уже существует'
            )
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
  )

  passport.use(
    new GoogleStrategy.Strategy(
      {
        clientID:
          '253862873552-3ehvplu8tuh5ocn2frh7gdhlnnrmn4nn.apps.googleusercontent.com',
        clientSecret: 'b318DCfMEEuxC2aaBC5vkWDT',
        callbackURL: 'http://localhost:3001/user/google/callback',
        proxy: true,
      },
      async function (accessToken, refreshToken, profile, done) {
        User.findOne({ googleId: profile.id }, (err, currentUser) => {
          if (err) {
            throw err
          }
          if (currentUser) {
            done(null, currentUser)
          } else {
            new User({
              googleId: profile.id,
              name: profile.name?.givenName,
            })
              .save()
              .then((googleUser) => {
                done(null, googleUser)
              })
          }
        })
      }
    )
  )

  passport.use(
    new JWTstrategy(
      {
        secretOrKey: 'TOP_SECRET',
        jwtFromRequest: ExtractJwt.fromUrlQueryParameter('secret_token'),
      },
      async (token, done) => {
        console.log(token)
        try {
          return done(null, token.user)
        } catch (error) {
          done(error)
        }
      }
    )
  )

  passport.serializeUser((user, cb) => {
    console.log(user)
    cb(null, user._id)
  })

  passport.deserializeUser((id, cb) => {
    User.findOne({ _id: id }, (err, user) => {
      cb(err, user)
    })
  })
}
