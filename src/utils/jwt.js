// src/utils/jwt.js
import "dotenv/config";  

import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
  console.error("❌ JWT_SECRET не найден в .env файле!");
  process.exit(1);
}

export class JWT {
  static signToken(payload) {
    return jwt.sign(payload, SECRET, { expiresIn: '7d' });
  }

  static verifyToken(token) {
    return jwt.verify(token, SECRET);
  }
}