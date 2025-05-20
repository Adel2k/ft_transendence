export function createMatchInfo(match: any, scores: { player1: number, player2: number }) {
    const container = document.createElement('div');
    container.className =
        'fixed top-6 left-4 right-4 z-[1000] bg-[rgba(30,30,30,0.85)] rounded-xl px-8 py-3 shadow-lg flex flex-col items-center max-w-[600px] w-[calc(100vw-32px)] min-w-0';

    container.innerHTML = `
      <div class="flex flex-row items-end justify-center gap-8 w-full">
        <div class="flex flex-col items-center">
          <img src="${match.player1?.user?.avatarUrl || '/default-avatar.png'}"
               class="w-16 h-16 rounded-full border-4 border-red-500 mb-2 sm:w-10 sm:h-10"
               alt="Player 1" />
          <div class="text-lg font-bold text-white sm:text-base">${match.player1?.user?.username || 'Player 1'}</div>
        </div>
        <div class="flex flex-row items-center text-3xl font-bold text-white mx-8 sm:text-xl">
          <span id="score-p1">${scores.player1}</span>
          <span class="mx-4">VS</span>
          <span id="score-p2">${scores.player2}</span>
        </div>
        <div class="flex flex-col items-center">
          <img src="${match.player2?.user?.avatarUrl || '/default-avatar.png'}"
               class="w-16 h-16 rounded-full border-4 border-blue-500 mb-2 sm:w-10 sm:h-10"
               alt="Player 2" />
          <div class="text-lg font-bold text-white sm:text-base">${match.player2?.user?.username || 'Player 2'}</div>
        </div>
      </div>
    `;

    return container;
}