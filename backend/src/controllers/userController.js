import prisma from '../db/prisma.js';

const me = async (req, reply) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
            id: true,
            email: true,
            username: true,
            avatarUrl: true,
            wins: true,
            losses: true,
            totalMatches: true,
        },
    });

    reply.send({ user });
};

const updateAvatar = async (req, reply) => {
    const userId = req.user.id;
    const { avatarUrl } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user)
            return reply.status(404).send({ error: 'User not found.' });

        const newAvatar =
            avatarUrl && avatarUrl.trim() !== ''
                ? avatarUrl
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}`;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { avatarUrl: newAvatar },
        });

        reply.send({
            message: 'Avatar updated.',
            avatarUrl: updatedUser.avatarUrl,
        });
    } catch (err) {
        console.error(err);
        reply.status(500).send({ error: 'Failed to update avatar.' });
    }
};

const addFriend = async (req, reply) => {
    const userId = req.user.id;
    const friendId = parseInt(req.params.friendId);

    if (userId === friendId)
        return reply.status(400).send({ error: "You can't friend yourself." });

    try {
        const existing = await prisma.friendship.findFirst({
            where: {
                OR: [
                    { userId, friendId },
                    { userId: friendId, friendId: userId },
                ],
            },
        });

        if (existing)
            return reply.status(400).send({ error: "You're already friends." });

        await prisma.friendship.create({
            data: { userId, friendId },
        });

        reply.send({ message: "Friend added." });
    } catch (err) {
        console.error(err);
        reply.status(500).send({ error: 'Failed to add friend.' });
    }
};

const listFriends = async (req, reply) => {
    const userId = req.user.id;

    try {
        const friendships = await prisma.friendship.findMany({
            where: {
                OR: [
                    { userId },
                    { friendId: userId },
                ],
            },
            include: {
                user: true,
                friend: true,
            },
        });

        const friends = friendships.map((f) => {
            const friend =
                f.userId === userId ? f.friend : f.user;
            return {
                id: friend.id,
                username: friend.username,
                avatarUrl: friend.avatarUrl,
                isOnline: false,
            };
        });

        reply.send({ friends });
    } catch (err) {
        console.error(err);
        reply.status(500).send({ error: 'Failed to get friends list.' });
    }
};

const getMatchHistory = async (req, reply) => {
    const userId = req.user.id;

    try {
        const matches = await prisma.match.findMany({
            where: {
                OR: [
                    { player1Id: userId },
                    { player2Id: userId },
                ],
            },
            include: {
                player1: true,
                player2: true,
                winner: true,
            },
            orderBy: { playedAt: 'desc' },
        });

        const history = matches.map((match) => {
            const isWinner = match.winnerId === userId;

            return {
                id: match.id,
                opponent:
                    match.player1Id === userId
                        ? match.player2.username
                        : match.player1.username,
                result: isWinner ? 'win' : 'loss',
                playedAt: match.playedAt,
            };
        });

        reply.send({ history });
    } catch (err) {
        console.error(err);
        reply.status(500).send({ error: 'Failed to load match history.' });
    }
};

const updateUsername = async (req, reply) => {
    const userId = req.user.id;
    const { username } = req.body;

    if (!username || username.trim() === '')
        return reply.status(400).send({ error: 'Username is required.' });

    try {
        const existing = await prisma.user.findUnique({
            where: { username },
        });

        if (existing)
            return reply.status(409).send({ error: 'Username already in use.' });

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { username },
        });

        reply.send({
            message: 'Username updated successfully.',
            username: updatedUser.username,
        });
    } catch (err) {
        console.error(err);
        reply.status(500).send({ error: 'Failed to update username.' });
    }
};

export default {
    me,
    updateAvatar,
    addFriend,
    listFriends,
    getMatchHistory,
    updateUsername
};
