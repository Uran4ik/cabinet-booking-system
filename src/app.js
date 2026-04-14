import express from 'express';
import cors from 'cors';
import loggerMiddleware from './middleware/loggerMiddleware.js';
import authMiddleware from './middleware/authMiddleware.js';
import authRouter from './routes/authRouter.js';
import bookingRouter from './routes/bookingRouter.js';
import errorMiddleware from './middleware/errorMiddleware.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(loggerMiddleware);

app.use('/api/auth', authRouter);

// Защищённые маршруты (только авторизованные пользователи)
app.use('/api', authMiddleware, bookingRouter);

app.use(errorMiddleware);

export default app;