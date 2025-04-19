export function validateEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
  }
  
  export function validatePassword(password) {
	const passwordRegex = /^(?=.*[A-Z]).{8,}$/;
	return passwordRegex.test(password);
  }
  