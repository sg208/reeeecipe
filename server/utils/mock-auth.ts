import { randomUUID } from 'node:crypto';
import type { H3Event } from 'h3';
import { getHeader } from 'h3';
import type { AuthLoginResponse, AuthTokens, AuthUser } from '~/types';

interface MockSession {
  user: AuthUser;
  refreshToken: string;
  expiresAt: number;
}

const ONE_HOUR_IN_SECONDS = 60 * 60;

const sessions = new Map<string, MockSession>();

const buildUser = (email: string): AuthUser => {
  const normalizedEmail = email.trim().toLowerCase();

  return {
    id: 1,
    name: 'Demo Chef',
    email: normalizedEmail,
    avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      normalizedEmail
    )}`,
  };
};

const createTokens = (refreshToken?: string): AuthTokens => ({
  accessToken: randomUUID(),
  refreshToken: refreshToken ?? randomUUID(),
  tokenType: 'Bearer',
  expiresIn: ONE_HOUR_IN_SECONDS,
});

export const createMockLoginResponse = (email: string): AuthLoginResponse => {
  const user = buildUser(email);
  const tokens = createTokens();

  sessions.set(tokens.accessToken, {
    user,
    refreshToken: tokens.refreshToken ?? '',
    expiresAt: Date.now() + ONE_HOUR_IN_SECONDS * 1000,
  });

  return {
    user,
    tokens,
  };
};

export const getUserFromSession = (accessToken: string): AuthUser | null => {
  const session = sessions.get(accessToken);

  if (!session) {
    return null;
  }

  if (session.expiresAt <= Date.now()) {
    sessions.delete(accessToken);
    return null;
  }

  return session.user;
};

export const removeSession = (accessToken: string): void => {
  sessions.delete(accessToken);
};

export const extractBearerToken = (event: H3Event): string | null => {
  const authorization = getHeader(event, 'authorization');

  if (!authorization) {
    return null;
  }

  const [, token] = authorization.match(/^Bearer\s+(.+)$/i) ?? [];

  return token ?? null;
};
