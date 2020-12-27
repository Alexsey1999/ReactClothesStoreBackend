import VKontakteStrategy from 'passport-vkontakte'
import User from '../../models/user'

export default new VKontakteStrategy.Strategy(
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
          name: profile.name!.givenName,
        })
          .save()
          .then((vkUser) => {
            done(null, vkUser)
          })
      }
    })
  }
)
