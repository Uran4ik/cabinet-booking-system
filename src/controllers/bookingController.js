import { BookingService, LESSONS } from '../services/bookingService.js';

class BookingController {
  constructor() {
    this.bookingService = new BookingService();
  }

  getRooms = async (req, res, next) => {
    try {
      const rooms = await this.bookingService.getAllRooms();
      res.json(rooms);
    } catch (error) {
      next(error);
    }
  };

  getUsers = async (req, res, next) => {
    try {
      const users = await this.bookingService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  };

  getLessons = async (req, res, next) => {
    try {
      res.json(LESSONS);
    } catch (error) {
      next(error);
    }
  };

  getRoomBookings = async (req, res, next) => {
    try {
      const { roomId } = req.params;
      const { date } = req.query;
      const bookings = await this.bookingService.getRoomBookingsForDate(roomId, date);
      res.json(bookings);
    } catch (error) {
      next(error);
    }
  };

  createBooking = async (req, res, next) => {
    try {
      const { roomId, date, lessonNumber, subject, classGroup, participants } = req.body;
      const booking = await this.bookingService.createBooking({
        roomId,
        date,
        lessonNumber,
        userId: req.user.id,
        subject,
        classGroup,
        participantIds: participants || []
      });
      res.status(201).json(booking);
    } catch (error) {
      next(error);
    }
  };

  getMyBookings = async (req, res, next) => {
    try {
      const bookings = await this.bookingService.getMyBookings(req.user.id);
      res.json(bookings);
    } catch (error) {
      next(error);
    }
  };

  cancelBooking = async (req, res, next) => {
    try {
      const result = await this.bookingService.cancelBooking({
        bookingId: req.params.id,
        userId: req.user.id
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}

export default new BookingController();