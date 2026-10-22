/** Password rules, shared by the browser forms and the server (no hashing code here). */
export const MIN_PASSWORD_LENGTH = 10;

/** Returns a problem with the password, or null if it's acceptable. */
export function passwordProblem(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) return `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  if (password.length > 200) return 'That password is too long.';
  return null;
}
