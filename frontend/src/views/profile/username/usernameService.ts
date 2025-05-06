export async function updateUsername(newUsername: string, token: string): Promise<void> {
    const response = await fetch('/api/user/username', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username: newUsername }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update username');
    }
  }
  
export async function updateAvatarIfNeeded(avatarURL: string, token: string): Promise<void> {
    if (avatarURL.startsWith('/avatars/')) return;

    const response = await fetch('/api/user/avatar', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({}),
    });

    if (!response.ok) {
        throw new Error('Failed to update avatar');
    }
}
  