import { describe, it, expect } from 'vitest';
import { validateEmail } from '~/utils/formatters';

describe('validateEmail', () => {
  it.each(['chef@example.com', 'a.b+tag@sub.domain.nl'])(
    'accepts %s',
    (email) => {
      expect(validateEmail(email)).toBe(true);
    }
  );

  it.each(['', 'plainaddress', 'no-at.example.com', 'user@', 'a b@c.com'])(
    'rejects "%s"',
    (email) => {
      expect(validateEmail(email)).toBe(false);
    }
  );
});
