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
  res.json({ message: error.message || 'Unknown error happened' })
})

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rc0u1.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
mongoose
  .connect(url, {
    bufferCommands: false,
    autoCreate: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    app.listen(process.env.PORT || 5000)
  })
  .catch(error => {
    console.log('could not connect', error)
  })