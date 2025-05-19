let socket: WebSocket | null = null;
let pingInterval: ReturnType<typeof setInterval>;

export function connectToWebSocket(token: string): void {
  if (socket) {
    return;
  }

  const wsUrl = `wss://${window.location.hostname}/api/ws`;
  socket = new WebSocket(wsUrl, token);

  setupSocketHandlers();
}

export function connectToMatchWebSocket(token: string, matchId: number): void {
  
  const wsUrl = `wss://${window.location.hostname}/api/ws/match/${matchId}`;
  socket = new WebSocket(wsUrl, token);

  console.log('Connecting to match WebSocket:', socket);

  setupSocketHandlers();
}

function setupSocketHandlers() {
  if (!socket) return;

  socket.onopen = () => {
    pingInterval = setInterval(() => {
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'ping' }));
      }
    }, 5000); 
  };

  socket.onerror = () => {
  };
  
  socket.onclose = () => {
    clearInterval(pingInterval);
    socket = null;
  };

  socket.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      if (msg.type === 'pong') return;
      else if (msg.type === 'paddle_move') {
        const { role, z } = msg;
        const event = new CustomEvent('paddle_move', { detail: { role, z } });
        window.dispatchEvent(event);
      } else if (msg.type === 'ball_update') {
        const { position, direction } = msg;
        const event = new CustomEvent('ball_update', { detail: { position, direction } });
        window.dispatchEvent(event);
      } else if (msg.type === 'tournament_started' && msg.redirectTo) {
        window.location.href = msg.redirectTo;
      } else if (msg.type === 'goal') {
        const event = new CustomEvent('goal', { detail: { scorer: msg.scorer } });
        window.dispatchEvent(event);
      }
    } catch (e) { }
  };
}

export function disconnectWebSocket(): void {
  if (socket) {
    socket.close();
    socket = null;
  }
}

export function getWebSocket(): WebSocket | null {
  return socket;
}