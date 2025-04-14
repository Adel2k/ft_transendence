export function setCookie(name: string, value: string): void {
  sessionStorage.setItem(name, value);
}

export function getCookie(name: string): string | null {
  return sessionStorage.getItem(name);
}

export function deleteCookie(name: string): void {
  sessionStorage.removeItem(name);
}