export async function fetchUserData(token: string) {
  const response = await fetch('/api/user/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch user data');
  const { user } = await response.json();
  
  const friendsResponse = await fetch('/api/user/friends', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const { friends } = await friendsResponse.json();
  if (!friendsResponse.ok) throw new Error('Failed to fetch friends');
  
  const historyResponse = await fetch('/api/user/history', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!historyResponse.ok) throw new Error('Failed to fetch match history');
  const { history } = await historyResponse.json();

  return { user, friends, history };
}
