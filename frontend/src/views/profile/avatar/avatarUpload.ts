export async function uploadAvatar(file: File, token: string): Promise<string> {
    const formData = new FormData();
    formData.append('avatar', file, file.name);
  
    const response = await fetch('/api/user/avatar', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
  
    if (!response.ok) {
      throw new Error('Failed to upload avatar');
    }
  
    const { avatarUrl } = await response.json();
    return avatarUrl;
}
  