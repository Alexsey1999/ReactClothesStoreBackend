import mongoose from 'mongoose'

mongoose.connect(
  'mongodb://localhost:27017/jollybellclone',
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  },
  (err: any) => {
    if (err) {
      throw Error(err)
    }
    console.log('Db connection was successful')
  }
)
