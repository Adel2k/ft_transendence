export function createHistorySection(matches: Array<{ opponent: string; result: string; playedAt: string }>): HTMLElement {
  const container = document.createElement('div');
  container.className = 'flex flex-col items-center gap-4';

  const title = document.createElement('h2');
  title.textContent = 'Match History';
  title.className = 'text-xl font-bold';

  const list = document.createElement('ul');
  list.className = 'w-full';

  matches.forEach(match => {
    const listItem = createMatchListItem(match);
    list.appendChild(listItem);
  });

  container.appendChild(title);
  container.appendChild(list);
  return container;
}

function createMatchListItem(match: { opponent: string; result: string; playedAt: string }): HTMLLIElement {
  const listItem = document.createElement('li');

  const resultColor = match.result.toLowerCase() === 'win' ? 'text-green-400' : 'text-red-400';
  const formattedDate = new Date(match.playedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  listItem.innerHTML = `
    <span class="font-bold">${match.opponent}</span> -
    <span class="${resultColor} font-semibold">${match.result}</span>
    <span class="text-gray-400">(${formattedDate})</span>
  `;
  listItem.className = 'p-2 rounded bg-gray-700 text-white';

  return listItem;
}