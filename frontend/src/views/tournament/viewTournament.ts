import { createNavbar } from '../../components/navbars';
import { getCookie } from '../../utils/cookies';
import { createFloatingShape } from '../shape/shapes';
import { connectToWebSocket } from '../../utils/socket';
import { showNotification } from '../../components/notification';

export function renderTournamentPage(root: HTMLElement, tournamentId: string, maxPlayers: number) {
    root.innerHTML = '';

    const token = getCookie('token');
    if (!token) {
        throw new Error('No token found');
    }

    connectToWebSocket(token);

    const container = document.createElement('div');
    container.className =
        'relative flex items-center justify-center min-h-screen w-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-fade-bg overflow-hidden';

    const shapesContainer = document.createElement('div');
    shapesContainer.className = 'absolute inset-0 overflow-hidden z-0';
    container.appendChild(shapesContainer);

    const contentWrapper = document.createElement('div');
    contentWrapper.className = `
        relative bg-gray-800 bg-opacity-90 
        p-6 sm:p-8 mt-8 mb-8 ml-16 rounded-lg shadow-lg 
        transform transition duration-500 hover:scale-105 z-10
        w-full max-w-sm sm:max-w-md md:max-w-lg
    `;


    const title = document.createElement('h2');
    title.className = 'text-3xl font-bold mb-4';
    title.textContent = 'Tournament Lobby';
    contentWrapper.appendChild(title);

    const participantContainer = document.createElement('div');
    participantContainer.className = 'grid grid-cols-4 gap-4 mb-4';
    contentWrapper.appendChild(participantContainer);

    const startButton = document.createElement('button');
    startButton.className = 'bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded hidden';
    startButton.textContent = 'Start Tournament';
    contentWrapper.appendChild(startButton);

    container.appendChild(contentWrapper);
    root.appendChild(container);

    setInterval(() => createFloatingShape(shapesContainer), 600);


    const invitedUsers: string[] = [];

    async function updateParticipantUI() {
        participantContainer.innerHTML = '';

        for (let i = 0; i < maxPlayers - 1; i++) {
            const slot = document.createElement('div');
            slot.className = 'w-16 h-16 rounded-full border-2 border-white flex items-center justify-center cursor-pointer';

            if (invitedUsers[i]) {
                slot.textContent = invitedUsers[i];
                slot.classList.add('bg-green-500');
            } else {
                slot.innerHTML = `
                    <div class="relative w-full h-full flex items-center justify-center">
                        <button
                        class="invite-btn flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 transition"
                        title="Пригласить игрока">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-300 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        </button>
                        <input
                        type="number"
                        min="1"
                        placeholder="ID"
                        class="invite-input absolute top-full mt-2 w-20 h-9 rounded-md px-3 py-1.5 text-sm text-black bg-white shadow-lg border border-gray-300 transition-all opacity-0 scale-95 pointer-events-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    `;

                const btn = slot.querySelector('.invite-btn') as HTMLButtonElement;
                const input = slot.querySelector('.invite-input') as HTMLInputElement;

                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    input.style.opacity = '1';
                    input.style.pointerEvents = 'auto';
                    input.style.transform = 'scale(1)';
                    input.focus();
                });

                input.addEventListener('blur', () => {
                    input.style.opacity = '0';
                    input.style.pointerEvents = 'none';
                    input.style.transform = 'scale(0.95)';
                });


                input.addEventListener('keydown', async (e) => {
                    if (e.key === 'Enter') {
                        const userId = input.value.trim();
                        if (userId) {
                            try {
                                const res = await fetch(`/api/tournament/${tournamentId}/join`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${token}`
                                    },
                                    body: JSON.stringify({ userId })
                                });

                                if (!res.ok) {
                                    const err = await res.json();
                                    showNotification(`Failed to invite ${userId}: ${err.error}`, 'error');
                                    return;
                                }

                                invitedUsers[i] = userId;
                                showNotification(`User ${userId} has been invited!`, 'success');
                                updateParticipantUI();
                            } catch (e) {
                                showNotification('Failed to invite player.', 'error');
                            }
                        }
                        input.blur();
                    }
                });
            }

            participantContainer.appendChild(slot);
        }

        startButton.classList.toggle('hidden', invitedUsers.length < maxPlayers - 1);
    }

    startButton.addEventListener('click', async () => {
        try {
            const startRes = await fetch(`/api/tournament/${tournamentId}/start`, { method: 'POST' });
            if (!startRes.ok) {
                const err = await startRes.json();
                showNotification(`Failed to start: ${err.error}`, 'error');
                return;
            }
        } catch (e) {
            showNotification('Failed to start the tournament', 'error');
        }
    });

    updateParticipantUI();
    createNavbar().then(navbar => {
        if (navbar) container.appendChild(navbar);
    });
}
