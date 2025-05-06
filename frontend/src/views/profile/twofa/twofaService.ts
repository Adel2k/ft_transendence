export async function disable2FA(token: string, code: string) {
  const response = await fetch('/api/2fa/off', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    throw new Error('Failed to disable 2FA');
  }
}
  
export async function request2FAQrCode(token: string): Promise<string> {
  const response = await fetch('/api/2fa/on', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error('Failed to generate 2FA setup');
  }

  const data = await response.json();
  return data.qr;
}

export async function enable2FA(token: string, code: string) {
  const response = await fetch('/api/2fa/on', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    throw new Error('Failed to enable 2FA');
  }
}
