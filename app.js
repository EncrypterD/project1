const express = require('express')
const path = require('path')
const hbs = require('hbs')
const err = require('err')
var mongoose = require('mongoose')
const app = express()
const bodyparser = require('body-parser')
const { check, validationResult, matchedData } = require('express-validator')
const fs = require('fs')
const session = require('express-session')
const flash = require('connect-flash')
const validator = require('validator')
// require('/db/conn')
const port = process.env.PORT || 3000

// mongoose
//   .connect('mongodb://localhost:27017/contactForm', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log('connected')
//   })
//   .catch((e) => {
//     console.log('not connected')
//   })
// mongoose.set('strictQuery', false)
// const conn = await mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log('connected succussfully')
//   })
//   .catch((e) => {
//     console.log('not connected')
//   })
// connecting mongoose
// mongoose
//   .connect('mongodb://127.0.0.1:27017/enrollForm', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//   })
//   .then(() => {
//     console.log('connected succussfully')
//   })
//   .catch((e) => {
//     console.log('not connected')
//   })
main().catch((err) => console.log(err))
mongoose.set('strictQuery', true)

async function main() {
  await mongoose
    .connect(
      'mongodb+srv://bansumit23:vL6ur1Ra11o2aamD@cluster0.pkbmtjg.mongodb.net/?retryWrites=true&w=majority',
    )
    .then(() => {
      console.log('connected succussfully')
    })
    .catch((e) => {
      console.log('not connected')
    })

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

var contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Please enter valid email')
      }
    },
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isMobilePhone(value)) {
        throw new Error('Please enter valid Number')
      }
    },
  },
  query: {
    type: String,
    require: true,
  },
})

var enrollSchema = new mongoose.Schema({
  myname: {
    type: String,
    required: true,
    validate(value) {
      if (
        !validator.isLength(value, [
          {
            min: 1,
            max: undefined,
          },
        ])
      ) {
        throw new Error('Enter a Username')
      }
    },
  },
  myemail: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Please enter valid email')
      }
    },
  },
  mynumber: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isMobilePhone(value)) {
        throw new Error('Please enter valid Number')
      }
    },
  },
  optionval: {
    type: Number,
  },
})

var contact = mongoose.model('contact', contactSchema)
var enroll = mongoose.model('enroll', enrollSchema)
// console.log('hello')
// Epress specific stuff
// script.use('')
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // this will help to bring the user form input to the express data

const static_path = path.join(__dirname, 'public')
app.use(express.static(static_path))

app.use(
  session({
    secret: 'secret',
    cookie: { maxage: 60000 },
    resave: false,
    saveUninitialized: false,
  }),
)
// set tempalte engine as a pug
// app.set('view engine', 'pug')
app.set('view engine', 'hbs')
// set the views directory

app.set('views', path.join(__dirname, 'views')) // views and template are equivalent

app.get('/contact', (req, res) => {
  res.status(200).render('contact.hbs')
})
// app.post('/', (req, res) => {
//   console.log(req.body)
//   const get_input = req.body
//   let jsonstr = JSON.stringify(get_input)
//   fs.writeFileSync('UserINPUT.txt', jsonstr)
//   const msg = { message: 'form has been succussfully subimitted' }
//   res.status(200).render('index.html', msg)
// })

// [
//   check('message')
//     .isLength({ min: 1 })
//     .withMessage('Message is required'),
//   check('email')
//     .isEmail()
//     .withMessage('That email doesn‘t look right')
// ],

app.post('/contact', (req, res) => {
  var mydata = new contact(req.body)
  mydata
    .save()
    .then(() => {
      res.send(
        'Your response has been Successfully recorded. We will Contact you soon',
      )
      // res.redirect('/contact')
    })
    .catch((e) => {
      res.status(400).send(e)
    })
  // return res.redirect('index.html')
})
app.post('/enroll', (req, res) => {
  var data = new enroll(req.body)
  const status = err.status || 500
  data
    .save()
    .then(() => {
      res.send(
        'your form has been submitted with the following data ' +
          JSON.stringify(data),
      )
    })
    .catch((e) => {
      res.status(status).send(e)
    })
  // res.render('index.hbs')
})

app.listen(port, () => {
  console.log(`the application is succussfully started at port ${port}`)
})
