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
    title.className = 'text-3xl font-bold mb-4 text-white';
    title.textContent = 'Tournament Lobby';
    contentWrapper.appendChild(title);

    const participantContainer = document.createElement('div');
    participantContainer.className = 'grid grid-cols-4 gap-4 mb-4';
    contentWrapper.appendChild(participantContainer);

    const startButton = document.createElement('button');
    startButton.className = 'bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded';
    startButton.textContent = 'Start Tournament';
    contentWrapper.appendChild(startButton);

    container.appendChild(contentWrapper);
    root.appendChild(container);

    setInterval(() => createFloatingShape(shapesContainer), 600);

    // Populate dummy participant slots
    function updateParticipantUI() {
        participantContainer.innerHTML = '';

        for (let i = 0; i < maxPlayers; i++) {
            const slot = document.createElement('div');
            slot.className = 'w-16 h-16 rounded-full border-2 border-white flex items-center justify-center text-white';
            slot.textContent = `P${i + 1}`;
            participantContainer.appendChild(slot);
        }
    }

    startButton.addEventListener('click', async () => {
        try {
            const res = await fetch(`/api/tournament/${tournamentId}/start`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!res.ok) {
                const err = await res.json();
                showNotification(`Failed to start: ${err.error}`, 'error');
                return;
            }

            showNotification('Tournament started!', 'success');
        } catch (e) {
            showNotification('Failed to start the tournament', 'error');
        }
    });

    updateParticipantUI();

    createNavbar().then(navbar => {
        if (navbar) container.appendChild(navbar);
    });
}
