import homeIcon from './homeIcon';
import gameIcon from './gameIcon';
import profileIcon from './profileIcon';
import settingsIcon from './settingsIcon';
import logoutIcon from './logoutIcon';

export function getIcon(name: string): string {
  const icons: Record<string, () => string> = {
    home: homeIcon,
    game: gameIcon,
    profile: profileIcon,
    settings: settingsIcon,
    logout: logoutIcon,
  };

  return icons[name]?.() || '';
}