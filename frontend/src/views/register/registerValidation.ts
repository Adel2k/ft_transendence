export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  const passwordRegex = /^(?=.*[A-Z]).{8,}$/;
  return passwordRegex.test(password);
}

export function validateUsername(username: string): boolean {
  const usernameRegex = /^(?=.*[a-zA-Z].*[a-zA-Z].*[a-zA-Z]).{5,}$/;
  return usernameRegex.test(username);
}

export function validateRegisterForm(email: string, username: string, password: string): string | null {
  if (!email || !username || !password) {
    return 'Please fill in all fields.';
  }

  if (!validateEmail(email)) {
    return 'Please enter a valid email address.';
  }

  if (!validateUsername(username)) {
    return 'Username must be at least 5 characters long and contain at least 3 letters.';
  }

  if (!validatePassword(password)) {
    return 'Password must be at least 8 characters long and contain at least one uppercase letter.';
  }

  return null;
}