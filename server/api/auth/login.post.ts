import type { AuthLoginPayload, AuthLoginResponse } from '~/types';
import { createMockLoginResponse } from '~/server/utils/mock-auth';

export default defineEventHandler(async (event): Promise<AuthLoginResponse> => {
  const body = await readBody<AuthLoginPayload>(event);

  if (!body?.email || !body?.password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email and password are required.',
    });
  }

  // Placeholder validation for demo purposes.
  if (body.password.length < 6) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Password must be at least 6 characters long.',
    });
  }

  return createMockLoginResponse(body.email);
});
