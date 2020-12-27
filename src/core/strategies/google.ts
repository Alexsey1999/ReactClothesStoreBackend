import GoogleStrategy from 'passport-google-oauth20'
import User from '../../models/user'

export default new GoogleStrategy.Strategy(
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
        done(undefined, currentUser)
      } else {
        new User({
          googleId: profile.id,
          name: profile.name?.givenName,
        })
          .save()
          .then((googleUser) => {
            done(undefined, googleUser)
          })
      }
    })
  }
)
