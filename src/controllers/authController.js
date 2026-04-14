import { AuthService } from '../services/authService.js';

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  register = async (req, res, next) => {
    try {
      const user = await this.authService.register(req.body);
      res.status(201).json({
        success: true,
        message: 'Регистрация прошла успешно',
        user,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const result = await this.authService.login(req.body);
      res.json({
        success: true,
        message: 'Вход выполнен успешно',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  getMe = async (req, res, next) => {
  try {
    const user = await this.authService.getUserById(req.user.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
  };

  updateProfile = async (req, res, next) => {
    try {
      const { name } = req.body;
      const user = await this.authService.updateProfile(req.user.id, { name });
      res.json({
        success: true,
        message: 'Профиль обновлен',
        user,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new AuthController();