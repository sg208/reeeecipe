import type { AuthUser } from '~/types';
import {
  extractBearerToken,
  getUserFromSession,
} from '~/server/utils/mock-auth';

export default defineEventHandler((event): AuthUser => {
  const token = extractBearerToken(event);

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthenticated.' });
  }

  const user = getUserFromSession(token);

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Session expired.' });
  }

  return user;
});
