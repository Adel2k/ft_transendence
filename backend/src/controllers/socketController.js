import prisma from '../db/prisma.js';
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

            conn.on('close', () => {
                onlineUsers.delete(userId);
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

        if (!token) {
            console.warn('❌ No WS token received');
            return conn?.close();
        }

        let decoded;
        try {
            decoded = await fastify.jwt.verify(token);
        } catch (err) {
            console.warn('❌ Invalid WS token:', err.message);
            return conn?.close();
        }

        const userId = decoded.id;

        const match = await prisma.tournamentMatch.findUnique({
            where: { id: matchId },
            include: {
                player1: { select: { userId: true } },
                player2: { select: { userId: true } },
            },
        });

        if (!match) {
            console.warn('❌ Match not found');
            return conn?.close();
        }


        const participant = await prisma.tournamentParticipant.findFirst({
            where: {
                tournamentId: match.tournamentId,
                userId: userId,
            },
        });

        if (!participant) {
            console.warn('❌ User is not a tournament participant');
            return conn?.close();
        }


        if (![match.player1.userId, match.player2.userId].includes(userId)) {
            console.warn('❌ User not assigned to this match');
            return conn?.close();
        }

        const playerNumber = match.player1.userId === userId ? 1 : 2;

        conn.send(JSON.stringify({ type: 'joined', player: playerNumber }));

        if (!matchSockets.has(matchId)) {
            matchSockets.set(matchId, []);
        }

        matchSockets.get(matchId).push(conn);

        conn.on('message', (raw) => {
            try {
                const msg = JSON.parse(raw.toString());

                if (msg.type === 'move') {
                    matchSockets.get(matchId)?.forEach((client) => {
                        if (client !== conn && client.readyState === 1) {
                            client.send(JSON.stringify({
                                type: 'opponent_move',
                                direction: msg.direction,
                                from: playerNumber,
                            }));
                        }
                    });
                } else {
                    console.warn('⚠️ Unknown message type:', msg.type);
                }
            } catch (e) {
                console.warn('❌ Invalid message format:', e.message);
            }
        });

        conn.on('close', () => {
            const sockets = matchSockets.get(matchId)?.filter((s) => s !== conn);
            if (sockets?.length === 0) {
                matchSockets.delete(matchId);
            } else {
                matchSockets.set(matchId, sockets);
            }
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
