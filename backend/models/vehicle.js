const mongoose = require('mongoose')

const vehicleSchema = new mongoose.Schema({
  description: { type: String, required: false },
  make: { type: String, required: false },
  model: { type: String, required: false },
  estimatedate: { type: String, required: false },
  id: { type: Number, required: false },
  image: { type: String, required: false },
  attendant: { type: String, required: false }
})

module.exports = mongoose.model('Vehicle', vehicleSchema)