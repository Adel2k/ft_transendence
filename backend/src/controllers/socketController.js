const onlineUsers = new Map();

const handleConnection = (fastify) => {
    return async function (conn, req) {
        let token = req.headers['sec-websocket-protocol'];
        if (Array.isArray(token)) token = token[0];

        if (!token) {
            console.warn('❗ No token received');
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
        onlineUsers.set(userId, conn);
        console.log(`🟢 User ${userId} connected`);

        conn.on('close', () => {
            onlineUsers.delete(userId);
            console.log(`🔴 User ${userId} disconnected`);
        });
    };
};

const isUserOnline = (userId) => onlineUsers.has(userId);
const getOnlineUsers = () => onlineUsers;

export default {
    handleConnection,
    isUserOnline,
    getOnlineUsers,
};
