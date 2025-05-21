import prisma from '../db/prisma.js';

const onlineUsers = new Map();
const matchSockets = new Map();
const matchBallState = new Map();

const handleConnection = (fastify) => {
    return async function (conn, req) {
        let token = req.headers['sec-websocket-protocol'];
        if (Array.isArray(token)) token = token[0];
        if (!token) return conn?.close();

        try {
            const decoded = await fastify.jwt.verify(token);
            const userId = decoded.id;
            onlineUsers.set(userId, conn);

            conn.on('message', (raw) => {
                try {
                    const msg = JSON.parse(raw.toString());
                    if (msg.type === 'ping') {
                        conn.send(JSON.stringify({ type: 'pong' }));
                    }
                } catch (e) {
                    console.warn('❌ Invalid message format:', e.message);
                }
            });

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
        if (!token) return conn?.close();

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
            select: {
                player1Id: true,
                player2Id: true,
                tournamentId: true,
            },
        });

        if (!match || ![match.player1Id, match.player2Id].includes(userId)) {
            return conn?.close();
        }

        if (!matchSockets.has(matchId)) matchSockets.set(matchId, []);
        matchSockets.get(matchId).push(conn);

        conn.on('message', (raw) => {
            try {
                const msg = JSON.parse(raw.toString());
                if (msg.type === 'ping') {
                    conn.send(JSON.stringify({ type: 'pong' }));
                    return;
                }
                if (msg.type === 'redirect') {
                    conn.send(JSON.stringify({ type: 'redirect', url: msg.url }));
                    return;
                }
                if (msg.type === 'paddle_move') {
                    const state = matchBallState.get(matchId);
                    if (state) {
                        if (msg.role === 'player1') state.paddle1z = msg.z;
                        if (msg.role === 'player2') state.paddle2z = msg.z;
                    }
                    matchSockets.get(matchId)?.forEach((client) => {
                        if (client !== conn && client.readyState === 1) {
                            client.send(JSON.stringify({
                                type: 'paddle_move',
                                role: msg.role,
                                z: msg.z
                            }));
                        }
                    });
                }
            } catch (e) {
                console.warn('❌ Invalid message format:', e.message);
            }
        });

        conn.on('close', () => {
            const sockets = matchSockets.get(matchId)?.filter((s) => s !== conn);
            if (!sockets?.length) {
                matchSockets.delete(matchId);
            } else {
                matchSockets.set(matchId, sockets);
            }
        });

        setTimeout(() => startBallForMatch(matchId), 5000);
    };
};

function startBallForMatch(matchId) {
    let position = { x: 0, y: 0.435, z: 0 };
    let direction = { x: 0, y: 0, z: 0 };
    let paddle1z = 0, paddle2z = 0;
    let paddleLength = 1.5;
    let paddleX1 = -4.5, paddleX2 = 4.5;

    if (!matchBallState.has(matchId)) {
        matchBallState.set(matchId, { position, direction, interval: null, paddle1z, paddle2z });
    }

    const state = matchBallState.get(matchId);

    function generateDirection() {
        return {
            x: Math.random() > 0.5 ? 0.05 : -0.05,
            y: 0,
            z: (Math.random() * 0.06) - 0.03
        };
    }

    function resetBall(delay = 3000) {
        state.position = { x: 0, y: 0.435, z: 0 };
        state.direction = { x: 0, y: 0, z: 0 };
        setTimeout(() => {
            state.direction = generateDirection();
        }, delay);
    }

    function tick() {
        let { position, direction } = state;
        position.x += direction.x;
        position.z += direction.z;

        if (position.z > 3 || position.z < -3) direction.z *= -1;

        if (
            direction.x < 0 &&
            position.x < paddleX1 - 0.23 &&
            Math.abs(position.z - state.paddle1z) < paddleLength / 2
        ) {
            direction.x *= -1;
            direction.z += (position.z - state.paddle1z) * 0.05;
        }

        if (
            direction.x > 0 &&
            position.x > paddleX2 + 0.23 &&
            Math.abs(position.z - state.paddle2z) < paddleLength / 2
        ) {
            direction.x *= -1;
            direction.z += (position.z - state.paddle2z) * 0.05;
        }

        if (position.x > 5 || position.x < -5) {
            const scorer = position.x > 5 ? 'player1' : 'player2';
            matchSockets.get(matchId)?.forEach((client) => {
                if (client.readyState === 1) {
                    client.send(JSON.stringify({ type: 'goal', scorer }));
                }
            });
            resetBall();
            return;
        }

        matchSockets.get(matchId)?.forEach((client) => {
            if (client.readyState === 1) {
                client.send(JSON.stringify({ type: 'ball_update', position, direction }));
            }
        });
    }

    resetBall();
    state.interval = setInterval(tick, 16);
}

const broadcastStartToTournament = async (userIds, matchInfo) => {
    console.log('Match info:', matchInfo);
    for (const userId of userIds) {
        const conn = onlineUsers.get(userId);
        if (conn?.readyState === 1) {
            conn.send(JSON.stringify({
                type: 'tournament_started',
                redirectTo: `/tournament/game/${matchInfo.tournamentId}`,
                ...matchInfo
            }));
        }
    }
};


const broadcastRedirect = async (userIds, url) => {
    for (const userId of userIds) {
        const conn = onlineUsers.get(userId);
        if (conn?.readyState === 1) {
            conn.send(JSON.stringify({ type: 'redirect', url }));
        }
    }
};

const isUserOnline = (userId) => onlineUsers.has(userId);
const getOnlineUsers = () => onlineUsers;

export default {
    handleConnection,
    handleMatchSocket,
    broadcastStartToTournament,
    broadcastRedirect,
    isUserOnline,
    getOnlineUsers
};
