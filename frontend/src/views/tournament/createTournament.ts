import { createNavbar } from '../../components/navbars';
import { createFloatingShape } from '../shape/shapes';
import { getCookie } from '../../utils/cookies';
import { showNotification } from '../../components/notification';


export async function createTournamentUI(): Promise<HTMLElement> {
    const token = getCookie('token');
    if (!token) {
        throw new Error('No token found');
    }
    const container = document.createElement('div');
    container.className =
        'relative flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-fade-bg overflow-hidden p-4';

    const shapesContainer = document.createElement('div');
    shapesContainer.className = 'absolute inset-0 overflow-hidden z-0';
    container.appendChild(shapesContainer);

    const formContainer = document.createElement('div');
    formContainer.className = `
        relative bg-gray-800 bg-opacity-90 
        p-6 sm:p-8 mt-8 mb-8 ml-16 rounded-lg shadow-lg 
        transform transition duration-500 hover:scale-105 z-10
        w-full max-w-sm sm:max-w-md md:max-w-lg
    `;

    formContainer.innerHTML = `
        <h2 class="text-2xl sm:text-3xl font-bold text-center text-white mb-6">Create Tournament</h2>
        <form id="create-tournament-form" class="flex flex-col gap-4">
            <input id="tournament-name" type="text" placeholder="Tournament Name"
                class="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required>

            <select id="max-players"
                class="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="2">2 Players</option>
                <option value="4" selected>4 Players</option>
                <option value="8">8 Players</option>
            </select>

            <button type="submit"
                class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300">
                Create
            </button>
        </form>
    `;

    formContainer.querySelector('#create-tournament-form')?.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nameInput = formContainer.querySelector<HTMLInputElement>('#tournament-name');
        const selectInput = formContainer.querySelector<HTMLSelectElement>('#max-players');

        const name = nameInput?.value.trim();
        const maxPlayers = parseInt(selectInput?.value || '4', 10);

        if (!name) {
            showNotification('Please enter a tournament name.', 'error');
            return;
        }

        try {
            const response = await fetch('/api/tournament/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });

            if (!response.ok) {
                const error = await response.json();
                showNotification(`Error: ${error.error}`, 'error');
                return;
            }

            const tournament = await response.json();
            showNotification(`Tournament  <<${tournament.name}>>  created successfully!`, 'success');

            window.location.href = `/tournament/${tournament.id}/${maxPlayers}`;
        } catch (error) {
            showNotification('Failed to create tournament. Please try again.', 'error');
        }
    });

    container.appendChild(formContainer);

    setInterval(() => createFloatingShape(shapesContainer), 600);

    const navbar = await createNavbar();
    if (navbar) {
        container.appendChild(navbar);
    }

    return container;
}
