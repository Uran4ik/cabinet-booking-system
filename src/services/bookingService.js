import prisma from '../lib/prisma.js';

// Конфигурация уроков
export const LESSONS = [
  { number: 1, start: "08:00", end: "08:45" },
  { number: 2, start: "08:45", end: "09:30" },
  { number: 3, start: "09:40", end: "10:25" },
  { number: 4, start: "10:45", end: "11:30" },
  { number: 5, start: "11:50", end: "12:35" },
  { number: 6, start: "12:55", end: "13:40" },
  { number: 7, start: "14:00", end: "14:45" },
  { number: 8, start: "15:05", end: "15:50" },
  { number: 9, start: "16:10", end: "16:55" },
  { number: 10, start: "17:15", end: "18:00" },
  { number: 11, start: "18:10", end: "18:55" },
  { number: 12, start: "18:55", end: "19:40" },
];

export class BookingService {
  async getAllRooms() {
    return prisma.room.findMany({ orderBy: { name: 'asc' } });
  }

  async getAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: { name: 'asc' }
    });
  }

  async getRoomBookingsForDate(roomId, date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.booking.findMany({
      where: {
        roomId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { lessonNumber: 'asc' },
    });
  }

  async createBooking({ roomId, date, lessonNumber, userId, subject, classGroup, participantIds = [] }) {
    const lesson = LESSONS.find(l => l.number === lessonNumber);
    if (!lesson) throw new Error('Неверный номер урока');

    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);

    // Парсим время урока
    const [startHour, startMinute] = lesson.start.split(':').map(Number);
    const [endHour, endMinute] = lesson.end.split(':').map(Number);

    const startTime = new Date(bookingDate);
    startTime.setHours(startHour, startMinute, 0);

    const endTime = new Date(bookingDate);
    endTime.setHours(endHour, endMinute, 0);

    // Проверяем, не занят ли кабинет на этот урок
    const existingBooking = await prisma.booking.findFirst({
      where: {
        roomId,
        date: bookingDate,
        lessonNumber,
      },
    });

    if (existingBooking) {
      throw new Error('Кабинет уже забронирован на этот урок');
    }

    const booking = await prisma.booking.create({
      data: {
        roomId,
        userId,
        date: bookingDate,
        lessonNumber,
        startTime,
        endTime,
        subject,
        classGroup,
      },
    });

    if (participantIds.length > 0) {
      await prisma.bookingParticipant.createMany({
        data: participantIds.map(participantId => ({
          bookingId: booking.id,
          userId: participantId,
        })),
      });
    }

    return booking;
  }

  async getMyBookings(userId) {
    const bookings = await prisma.booking.findMany({
      where: {
        OR: [
          { userId },
          { participants: { some: { userId } } },
        ],
      },
      include: {
        room: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: [{ date: 'desc' }, { lessonNumber: 'asc' }],
    });

    return bookings;
  }

  async cancelBooking({ bookingId, userId }) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { participants: true },
    });

    if (!booking) {
      throw new Error('Бронирование не найдено');
    }

    // Только создатель может отменить
    if (booking.userId !== userId) {
      throw new Error('Только создатель может отменить бронирование');
    }

    await prisma.bookingParticipant.deleteMany({
      where: { bookingId },
    });

    await prisma.booking.delete({
      where: { id: bookingId },
    });

    return { success: true };
  }

  getLessons() {
    return LESSONS;
  }
}