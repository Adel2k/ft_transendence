export async function isAuthenticated(): Promise<boolean> {
  const token = localStorage.getItem('token');
  return !!token;
}

export function logout() {
  localStorage.removeItem('token');
  history.pushState(null, '', '/');
  window.location.reload();
}