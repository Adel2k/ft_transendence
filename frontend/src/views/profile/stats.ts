export function createStatsSection(wins: number, losses: number): HTMLElement {
  const container = document.createElement('div');
  container.className = 'flex flex-col items-center gap-4';

  const stats = document.createElement('p');
  stats.textContent = `Wins: ${wins} | Losses: ${losses}`;
  stats.className = 'text-lg font-bold  ml-8';

  container.appendChild(stats);

  return container;
}