import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { loadDb } from './db.js';
import { AdminUser } from '../src/types.js';

const JWT_SECRET = process.env.JWT_SECRET || 'datasource-cms-default-secure-secret-token-key';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

export function generateToken(user: AdminUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): { id: string; email: string; role: string; name: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      role: string;
      name: string;
    };
    return decoded;
  } catch {
    return null;
  }
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  let token = '';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.headers.cookie) {
    const cookies = req.headers.cookie.split(';');
    for (const c of cookies) {
      const [k, v] = c.trim().split('=');
      if (k === 'admin_token') {
        token = v;
        break;
      }
    }
  }

  if (!token) {
    res.status(401).json({ error: 'Unauthorized: No authentication token provided' });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
    return;
  }

  const db = loadDb();
  const user = db.adminUsers.find((u) => u.id === payload.id && u.active);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized: Admin user not found or deactivated' });
    return;
  }

  req.user = payload;
  next();
}

// Simple in-memory rate limiter for login & contact
const rateLimits: Record<string, { count: number; expiresAt: number }> = {};

export function checkRateLimit(ip: string, maxAttempts = 10, windowMs = 60000): boolean {
  const now = Date.now();
  const entry = rateLimits[ip];
  if (!entry || entry.expiresAt < now) {
    rateLimits[ip] = { count: 1, expiresAt: now + windowMs };
    return true;
  }
  if (entry.count >= maxAttempts) {
    return false;
  }
  entry.count += 1;
  return true;
}
