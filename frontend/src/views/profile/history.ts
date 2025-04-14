export function createHistorySection(matches: Array<{ opponent: string; result: string; playedAt: string }>): HTMLElement {
  const container = document.createElement('div');
  container.className = 'flex flex-col items-center gap-4';

  const title = document.createElement('h2');
  title.textContent = 'Match History';
  title.className = 'text-xl font-bold';

  const list = document.createElement('ul');
  list.className = 'w-full';

  matches.forEach((match) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${match.opponent} - ${match.result} (${new Date(match.playedAt).toLocaleDateString()})`;
    listItem.className = 'p-2 rounded bg-gray-700 text-white';
    list.appendChild(listItem);
  });

  container.appendChild(title);
  container.appendChild(list);

  return container;
}