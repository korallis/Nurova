import bcrypt from 'bcryptjs';

export { MIN_PASSWORD_LENGTH, passwordProblem } from './password-rules';

const ROUNDS = 12;

export function hashPassword(password: string) {
  return bcrypt.hash(password, ROUNDS);
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
