const mongoose = require('mongoose')
mongoose
  .connect('mongodb://127.0.0.1:27017/enrollForm', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('connected succussfully')
  })
  .catch((e) => {
    console.log('not connected')
  })
