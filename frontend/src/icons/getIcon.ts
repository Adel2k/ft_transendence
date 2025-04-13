import homeIcon from './homeIcon.js';
import gameIcon from './gameIcon.js';
import profileIcon from './profileIcon.js';
import chatIcon from './chatIcon.js';
import settingsIcon from './settingsIcon.js';
import logoutIcon from './logoutIcon.js';

export function getIcon(name: string): string {
  const icons: Record<string, () => string> = {
    home: homeIcon,
    game: gameIcon,
    profile: profileIcon,
    chat: chatIcon,
    settings: settingsIcon,
    logout: logoutIcon,
  };

  return icons[name]?.() || '';
}