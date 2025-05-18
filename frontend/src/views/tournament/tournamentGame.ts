import { render as renderGame } from '../game/index';
import { getCookie } from '../../utils/cookies';
import { connectToMatchWebSocket, disconnectWebSocket } from '../../utils/socket';

export async function renderTournamentGamePage(root: HTMLElement, tournamentId: string) {
    root.innerHTML = '';
    
    const token = getCookie('token');
    if (!token) throw new Error('No token found');
    
    const res = await fetch(`/api/tournament/${tournamentId}/next-match`);
    const match = await res.json();

    connectToMatchWebSocket(token, match.id);

    let role: 'player1' | 'player2' | 'spectator' = 'spectator';
    if (match && match.player1 && match.player2) {
        const userId = JSON.parse(atob(token.split('.')[1])).id;
        if (match.player1.userId === userId) role = 'player1';
        else if (match.player2.userId === userId) role = 'player2';
    }

    renderGame(root, {role, match});
}