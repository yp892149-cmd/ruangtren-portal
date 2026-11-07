import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { db } from './db.ts';

// In-memory active session token store with expiration
interface SessionData {
  email: string;
  name: string;
  picture?: string;
  createdAt: number;
  expiresAt: number;
}

const activeSessions = new Map<string, SessionData>();
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export function getAllowedAdminEmails(): string[] {
  const defaults = ['yp892149@gmail.com', 'rullganteng987@gmail.com'];
  const envEmails = process.env.ADMIN_EMAILS
    ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase())
    : [];
  const dbEmails = db.getSettings().adminEmails || [];

  const combined = Array.from(new Set([...defaults, ...envEmails, ...dbEmails].map(e => e.toLowerCase())));
  return combined;
}

export function isEmailAuthorized(email: string): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  const allowed = getAllowedAdminEmails();
  return allowed.includes(normalized);
}

export function createAdminSession(email: string, name: string, picture?: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  activeSessions.set(token, {
    email: email.toLowerCase(),
    name,
    picture,
    createdAt: now,
    expiresAt: now + SESSION_DURATION_MS,
  });
  return token;
}

export function verifySessionToken(token: string): SessionData | null {
  if (!token) return null;
  const session = activeSessions.get(token);
  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return null;
  }

  // Also verify email is still on whitelist
  if (!isEmailAuthorized(session.email)) {
    activeSessions.delete(token);
    return null;
  }

  return session;
}

export function destroySession(token: string): void {
  activeSessions.delete(token);
}

// Express Middleware to protect admin routes
export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const cookieHeader = req.headers.cookie;

  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (cookieHeader) {
    const match = cookieHeader.match(/admin_token=([^;]+)/);
    if (match) token = match[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Autentikasi Diperlukan: Silakan login terlebih dahulu menggunakan Akun Google Administrator.',
    });
  }

  const session = verifySessionToken(token);
  if (!session) {
    return res.status(403).json({
      success: false,
      error: 'Sesi Tidak Valid atau Kedaluwarsa: Akses ditolak. Hanya administrator terdaftar yang dapat mengelola portal.',
    });
  }

  // Attach to request
  (req as any).adminUser = session;
  next();
}
