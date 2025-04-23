const onlineUsers = new Map();
const matchSockets = new Map();

const handleConnection = (fastify) => {
    return async function (conn, req) {
        let token = req.headers['sec-websocket-protocol'];
        if (Array.isArray(token)) token = token[0];

        if (!token) return conn?.close();

        try {
            const decoded = await fastify.jwt.verify(token);
            const userId = decoded.id;
            onlineUsers.set(userId, conn);
            console.log(`🟢 User ${userId} connected`);

            conn.on('close', () => {
                onlineUsers.delete(userId);
                console.log(`🔴 User ${userId} disconnected`);
            });
        } catch (err) {
            console.warn('❌ Invalid WS token:', err.message);
            return conn?.close();
        }
    };
};

const handleMatchSocket = (fastify) => {
    return async function (conn, req) {
        const matchId = parseInt(req.params.matchId);
        let token = req.headers['sec-websocket-protocol'];
        if (Array.isArray(token)) token = token[0];

        if (!token) return conn?.close();

        let decoded;
        try {
            decoded = await fastify.jwt.verify(token);
        } catch (err) {
            console.warn('❌ Invalid WS token:', err.message);
            return conn?.close();
        }

        const userId = decoded.id;
        const match = await fastify.prisma.tournamentMatch.findUnique({
            where: { id: matchId },
        });

        if (!match || ![match.player1Id, match.player2Id].includes(userId)) {
            console.warn('Unauthorized match access');
            return conn?.close();
        }

        const playerNumber = match.player1Id === userId ? 1 : 2;

        console.log(`🎮 User ${userId} joined match ${matchId} as Player ${playerNumber}`);
        conn.socket.send(JSON.stringify({ type: 'joined', player: playerNumber }));

        if (!matchSockets.has(matchId)) {
            matchSockets.set(matchId, []);
        }

        matchSockets.get(matchId).push(conn.socket);

        conn.socket.on('message', (raw) => {
            try {
                const msg = JSON.parse(raw.toString());

                matchSockets.get(matchId).forEach((client) => {
                    if (client !== conn.socket && client.readyState === 1) {
                        client.send(JSON.stringify({ ...msg, from: playerNumber }));
                    }
                });
            } catch (e) {
                console.warn('❌ Invalid message format', e.message);
            }
        });

        conn.socket.on('close', () => {
            const sockets = matchSockets.get(matchId)?.filter((s) => s !== conn.socket);
            if (sockets?.length === 0) {
                matchSockets.delete(matchId);
            } else {
                matchSockets.set(matchId, sockets);
            }
            console.log(`🔴 Player ${playerNumber} left match ${matchId}`);
        });
    };
};

const isUserOnline = (userId) => onlineUsers.has(userId);
const getOnlineUsers = () => onlineUsers;

export default {
    handleConnection,
    handleMatchSocket,
    isUserOnline,
    getOnlineUsers,
};
