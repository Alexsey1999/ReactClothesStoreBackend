// @ts-nocheck
import LocalStrategy from 'passport-local'
import RememberMeStrategy from 'passport-remember-me'
import User from '../models/user'
import bcrypt from 'bcrypt'
import { Strategy as JWTstrategy, ExtractJwt } from 'passport-jwt'
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth'
import { randomString } from '../utils'

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
    new GoogleStrategy(
      {
        clientID:
          '253862873552-3ehvplu8tuh5ocn2frh7gdhlnnrmn4nn.apps.googleusercontent.com',
        clientSecret: 'b318DCfMEEuxC2aaBC5vkWDT',
        callbackURL: 'http://localhost:3001/user/google/callback',
      },
      async function (accessToken, refreshToken, profile, done) {
        let [err, user] = await to(getUserByProviderId(profile.id))
        if (err || user) {
          return done(err, user)
        }

        const verifiedEmail =
          profile.emails.find((email) => email.verified) || profile.emails[0]

        const [createdError, createdUser] = await to(
          createUser({
            provider: profile.provider,
            providerId: profile.id,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            displayName: profile.displayName,
            email: verifiedEmail.value,
            password: null,
          })
        )

        return done(createdError, createdUser)
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
    cb(null, user._id)
  })

  passport.deserializeUser((id, cb) => {
    User.findOne({ _id: id }, (err, user) => {
      cb(err, user)
    })
  })
}
