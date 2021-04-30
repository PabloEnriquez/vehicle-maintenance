const { validationResult } = require('express-validator')

const HttpError = require('./models/http-error')
const Vehicle = require('./models/vehicle')


const getVehicles = async (req, res, next) => {
  let vehicles

  try {
    vehicles = await Vehicle.find()
  } catch (err) {
    const error = new HttpError('Could not retrieve vehicles', 500)
    return next(error)
  }

  if (!vehicles || vehicles.length <= 0) {
    return next([])
  }

  res.status(200).json(vehicles.map(vehicle => vehicle.toObject()))
}

const setMaintenance = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs', 400)
    ) 
  }

  const { attendant, estimatedate } = req.body
  const vehicleId = req.params.vehicleId

  let vehicle
  try {
    vehicle = await Vehicle.findOne({ id: vehicleId })
  } catch (err) {
    return next(
      new HttpError('Error getting vehicle to update', 500)
    )
  }

  if (!vehicle) {
    return next(
      new HttpError('Could not find vehicle to update', 404)
    )
  }

  vehicle.attendant = attendant
  vehicle.estimatedate = estimatedate

  try {
    await vehicle.save()
  } catch (err) {
    return next(
      new HttpError('Could not update vehicle', 500)
    )
  }

  res.status(200).json(vehicle.toObject())
}

const createVehicle = async (req, res, next) => {
  // const {
  //   description, make, model, id, image, attendant, estimatedate, maintenance
  // } = req.body
  const createdVehicle = new Vehicle(req.body)

  try {
    await createdVehicle.save()
  } catch (err) {
    const error = new HttpError('Could not create vehicle', 500)
    return next(error)
  }

  res.status(201).json({ newVehicle: createdVehicle })
}

exports.getVehicles = getVehicles
exports.setMaintenance = setMaintenance
exports.createVehicle = createVehicle