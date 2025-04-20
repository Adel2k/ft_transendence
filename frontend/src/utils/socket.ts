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
  };

  socket.onclose = () => {
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