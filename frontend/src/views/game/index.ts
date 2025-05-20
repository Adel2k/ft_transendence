import { createPongScene } from './createScene';
import { createNavbar } from '../../components/navbars';
import { createMatchInfo } from './matchInfo';
import { renderTournamentGamePage } from '../tournament/tournamentGame';
import { getWebSocket } from '../../utils/socket';

export async function render(root: HTMLElement, options?: { role: string, match: any, tournamentId?: string }) {
    root.innerHTML = '';

    let scores = { player1: 0, player2: 0 };
    const matchInfo = createMatchInfo(options?.match, scores);
    root.appendChild(matchInfo);

    const canvas = document.createElement('canvas');
    canvas.id = 'gameCanvas';
    canvas.className = 'w-screen h-screen';
    root.appendChild(canvas);

    createPongScene(canvas, options);

    const navbar = await createNavbar();
    if (navbar) {
        root.appendChild(navbar);
    }

    window.addEventListener('goal', (e: any) => {
        scores[e.detail.scorer]++;
        matchInfo.querySelector('#score-p1')!.textContent = scores.player1.toString();
        matchInfo.querySelector('#score-p2')!.textContent = scores.player2.toString();

        if (scores.player1 >= 5 || scores.player2 >= 5) {
            window.dispatchEvent(new CustomEvent('stop_ball'));

            const winnerId = scores.player1 >= 5 ? options?.match.player1.userId : options?.match.player2.userId;
            const winnerRole = scores.player1 >= 5 ? 'player1' : 'player2';
            const tournamentId = options?.match.tournamentId;
            const matchId = options?.match.id;

            if (options?.role === winnerRole && tournamentId && matchId) {
                fetch(`/api/tournament/${tournamentId}/match/${matchId}/winner`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ winnerId }),
                }).then(async res => {
                    const data = await res.json();
                    if (data.message === 'Tournament finished!') {
                        await fetch(`/api/ws/tournament/${tournamentId}/end`, { method: 'POST' });
                        window.location.href = '/profile';
                    } else {
                        const nextMatchRes = await fetch(`/api/tournament/${tournamentId}/next-match`);
                        const nextMatch = await nextMatchRes.json();
                        if (nextMatch && nextMatch.id) {
                            await fetch(`/api/ws/tournament/${tournamentId}/next`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ url: `/tournament/game/${tournamentId}` }),
                            });
                        } else {
                            alert('Турнир завершён!');
                            await fetch(`/api/ws/tournament/${tournamentId}/end`, { method: 'POST' });
                            window.location.href = '/profile';
                        }
                    }
                });
            }
        }
    });
}
