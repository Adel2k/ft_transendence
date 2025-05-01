export async function deleteAvatar(token: string, avatarUrl: string): Promise<void> {
    if (avatarUrl.startsWith('/avatars/')) {
      const response = await fetch('/api/user/avatar', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete avatar');
      }
    } else {
      throw new Error('Cannot delete default avatar');
    }
}
  