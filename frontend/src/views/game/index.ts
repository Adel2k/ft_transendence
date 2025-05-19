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
            if (options?.role === winnerRole) {
                fetch(`/api/tournament/${options?.match.tournamentId}/match/${options?.match.id}/winner`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ winnerId }),
                }).then(async res => {
                    const data = await res.json();
                    console.log('Response data:', data);
                    if (data.message === 'Tournament finished!') {
                        //ВОт тут вот нужна эта логика
                    } else {
                        const nextMatchRes = await fetch(`/api/tournament/${options?.match.tournamentId}/next-match`);
                        const nextMatch = await nextMatchRes.json();
                        if (nextMatch && nextMatch.id) {
                            renderTournamentGamePage(root, options?.match.tournamentId);
                        } else {
                            alert('Турнир завершён!');
                            window.location.href = `/tournament/${options?.match.tournamentId}`;
                        }
                    }
                });
            }
        }
    });
}