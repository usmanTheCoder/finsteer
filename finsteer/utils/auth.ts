import { serialize, parse } from 'cookie';
import { authenticateUser, createUser } from '@/server/api/auth';
import { UserCredentials, UserData } from '@/types';
import { generateToken, verifyToken } from './jwt';

const TOKEN_NAME = 'finsteer_token';
const MAX_AGE = 60 * 60 * 24 * 7; // 1 week

export const setAuthCookie = (res: Response, token: string) => {
  const serialized = serialize(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: MAX_AGE,
    path: '/',
  });

  res.setHeader('Set-Cookie', serialized);
};

export const getAuthCookie = (req: Request) => {
  const cookies = req.headers.get('cookie');
  if (!cookies) return null;

  const parsed = parse(cookies);
  return parsed[TOKEN_NAME] ?? null;
};

export const removeAuthCookie = (res: Response) => {
  const serialized = serialize(TOKEN_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: -1,
    path: '/',
  });

  res.setHeader('Set-Cookie', serialized);
};

export const authenticateUserWithCredentials = async (
  credentials: UserCredentials,
) => {
  const user = await authenticateUser(credentials);
  if (!user) return null;

  const token = generateToken(user);
  return { user, token };
};

export const registerUser = async (userData: UserData) => {
  const user = await createUser(userData);
  if (!user) return null;

  const token = generateToken(user);
  return { user, token };
};

export const getAuthenticatedUser = async (req: Request) => {
  const token = getAuthCookie(req);
  if (!token) return null;

  try {
    const decodedToken = verifyToken(token);
    return decodedToken;
  } catch (err) {
    console.error('Error verifying token:', err);
    return null;
  }
};