import express from 'express';
import bookingController from '../controllers/bookingController.js';

const router = express.Router();

router.get('/rooms', bookingController.getRooms);
router.get('/users', bookingController.getUsers);
router.get('/lessons', bookingController.getLessons);
router.get('/rooms/:roomId/bookings', bookingController.getRoomBookings);
router.post('/bookings', bookingController.createBooking);
router.get('/bookings/my', bookingController.getMyBookings);
router.delete('/bookings/:id', bookingController.cancelBooking);

export default router;