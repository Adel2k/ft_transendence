export function createMatchInfo(match: any, scores: { player1: number, player2: number }) {
    const container = document.createElement('div');
    container.className = 'match-info-bar';
    container.style.position = 'fixed';
    container.style.top = '24px';
    container.style.left = '50%';
    container.style.transform = 'translateX(-50%)';
    container.style.zIndex = '1000';
    container.style.background = 'rgba(30,30,30,0.85)';
    container.style.borderRadius = '16px';
    container.style.padding = '12px 32px';
    container.style.boxShadow = '0 2px 16px rgba(0,0,0,0.3)';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.minWidth = '420px';
    container.style.maxWidth = '600px';

    const playersRow = document.createElement('div');
    playersRow.className = 'flex flex-row items-end justify-center gap-16';

    // Player 1
    const p1 = document.createElement('div');
    p1.className = 'flex flex-col items-center';
    const p1Avatar = document.createElement('img');
    p1Avatar.src = match.player1?.user?.avatarUrl || '/default-avatar.png';
    p1Avatar.style.width = '64px';
    p1Avatar.style.height = '64px';
    p1Avatar.style.borderRadius = '50%';
    p1Avatar.style.border = '3px solid #ef4444';
    p1Avatar.style.marginBottom = '8px';
    const p1Name = document.createElement('div');
    p1Name.style.fontSize = '18px';
    p1Name.style.fontWeight = 'bold';
    p1Name.style.color = '#fff';
    p1Name.textContent = match.player1?.user?.username || 'Player 1';
    p1.appendChild(p1Avatar);
    p1.appendChild(p1Name);

    // Player 2
    const p2 = document.createElement('div');
    p2.className = 'flex flex-col items-center';
    const p2Avatar = document.createElement('img');
    p2Avatar.src = match.player2?.user?.avatarUrl || '/default-avatar.png';
    p2Avatar.style.width = '64px';
    p2Avatar.style.height = '64px';
    p2Avatar.style.borderRadius = '50%';
    p2Avatar.style.border = '3px solid #3b82f6';
    p2Avatar.style.marginBottom = '8px';
    const p2Name = document.createElement('div');
    p2Name.style.fontSize = '18px';
    p2Name.style.fontWeight = 'bold';
    p2Name.style.color = '#fff';
    p2Name.textContent = match.player2?.user?.username || 'Player 2';
    p2.appendChild(p2Avatar);
    p2.appendChild(p2Name);

    // Score
    const score = document.createElement('div');
    score.style.display = 'flex';
    score.style.flexDirection = 'row';
    score.style.alignItems = 'center';
    score.style.fontSize = '32px';
    score.style.fontWeight = 'bold';
    score.style.color = '#fff';
    score.style.margin = '0 32px';
    score.innerHTML = `
        <span id="score-p1">${scores.player1}</span>
        <span style="margin: 0 16px;">VS</span>
        <span id="score-p2">${scores.player2}</span>
    `;

    playersRow.appendChild(p1);
    playersRow.appendChild(score);
    playersRow.appendChild(p2);

    container.appendChild(playersRow);

    return container;
}