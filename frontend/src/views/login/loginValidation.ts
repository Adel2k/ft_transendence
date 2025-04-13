export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  const passwordRegex = /^(?=.*[A-Z]).{8,}$/;
  return passwordRegex.test(password);
}

export function validateLoginForm(email: string, password: string): string | null {
  if (!email || !password) {
    return 'Please fill in all fields.';
  }

  if (!validateEmail(email)) {
    return 'Please enter a valid email address.';
  }

  if (!validatePassword(password)) {
    return 'Password must be at least 8 characters long and contain at least one uppercase letter.';
  }

  return null;
}