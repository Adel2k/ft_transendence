export function createStatsSection(wins: number, losses: number): HTMLElement {
    const container = document.createElement('div');
    container.className = 'flex flex-col items-center gap-4';

    const stats = document.createElement('p');
    stats.innerHTML = formatStatsHTML(wins, losses);
    stats.className = 'text-lg font-bold ml-8';

    container.appendChild(stats);

    return container;
}
  
function formatStatsHTML(wins: number, losses: number): string {
    return `
        <span class="text-green-400">Wins: ${wins}</span> |
        <span class="text-red-400">Losses: ${losses}</span>
    `;
}
  