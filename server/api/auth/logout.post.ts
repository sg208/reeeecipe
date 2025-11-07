import { extractBearerToken, removeSession } from '~/server/utils/mock-auth';

interface LogoutResponse {
  success: boolean;
}

export default defineEventHandler((event): LogoutResponse => {
  const token = extractBearerToken(event);

  if (token) {
    removeSession(token);
  }

  return { success: true };
});
