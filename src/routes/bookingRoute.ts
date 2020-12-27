import { Router } from 'express'

import { BookingController } from '../controllers'

const bookingRoute = Router()

bookingRoute.get('/', BookingController.makeOrder)
bookingRoute.post('/checktoken', BookingController.checkTokenOrder)
bookingRoute.post('/payment', BookingController.paymentOrder)
bookingRoute.post('/addorder', BookingController.addOrder)

export default bookingRoute
