const express = require('express')
const mongoose = require('mongoose')

const routes = require('./routes')
const HttpError = require('./models/http-error')

const app = express()

app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

app.use(routes)

app.use((req, res, next) => {
  throw new HttpError('Could not find the route', 404)
})

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error)
  }
  res.status(error.code || 500)
  res.json({ message: error.message || 'Unknown error' })
})

const url = 'mongodb+srv://pablo:Du1BcwIIsvsth0Im@cluster0.rc0u1.mongodb.net/vehicles_test?retryWrites=true&w=majority'
mongoose
  .connect(url, {
    bufferCommands: false,
    autoCreate: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    app.listen(5000)
  })
  .catch(error => {
    console.log('could not connect', error)
  })