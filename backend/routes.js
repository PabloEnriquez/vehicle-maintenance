const express = require('express')
const { check } = require('express-validator')

const controller = require('./controller')

const router = express.Router()

router.get('/', controller.getVehicles)

router.patch(
  '/:vehicleId',
  [
    check('attendant').not().isEmpty(),
    check('estimatedate').not().isEmpty()
  ],
  controller.setMaintenance
)

router.post('/', controller.createVehicle)

module.exports = router