let socket: WebSocket | null = null;

export function connectToWebSocket(token: string): void {
  if (socket) {
    return;
  }

  const wsUrl = `wss://${window.location.hostname}/api/ws`;
  socket = new WebSocket(wsUrl, token);

  socket.onopen = () => {
  };

  socket.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      if (msg.type === 'tournament_started' && msg.redirectTo) {
        window.location.href = msg.redirectTo;
      }
    } catch (e) {
    }
  };

  socket.onclose = () => {;
    socket = null;
  };

  socket.onerror = (error) => {
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