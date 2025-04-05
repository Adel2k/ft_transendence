import prisma from '../db/prisma.js';

const createMatch = async (req, reply) => {
    const { opponentId } = req.body;
    const userId = req.user.id;

    if (userId === opponentId)
        return reply.status(400).send({ error: "You can't play against yourself." });

    try {
        const opponent = await prisma.user.findUnique({ where: { id: opponentId } });

        if (!opponent)
            return reply.status(404).send({ error: "Opponent not found." });

        const match = await prisma.match.create({
            data: {
                player1Id: userId,
                player2Id: opponentId,
                winnerId: userId,
            },
            include: {
                player1: true,
                player2: true,
            },
        });

        reply.send({
            message: 'Match created.',
            match: {
                id: match.id,
                vs: `${match.player1.username} vs ${match.player2.username}`,
                winner: match.player1.username,
                playedAt: match.playedAt,
            },
        });
    } catch (err) {
        console.error(err);
        reply.status(500).send({ error: 'Failed to create match.' });
    }
};

const updateResult = async (req, reply) => {
    const { matchId } = req.params;
    const { winnerId } = req.body;
    const userId = req.user.id;

    try {
        const match = await prisma.match.findUnique({ where: { id: parseInt(matchId) } });

        if (!match)
            return reply.status(404).send({ error: 'Match not found.' });

        if (match.player1Id !== userId && match.player2Id !== userId)
            return reply.status(403).send({ error: 'Not your match to update.' });

        const updatedMatch = await prisma.match.update({
            where: { id: parseInt(matchId) },
            data: { winnerId },
        });

        const loserId =
            updatedMatch.player1Id === winnerId
                ? updatedMatch.player2Id
                : updatedMatch.player1Id;

        await prisma.user.updateMany({
            where: { id: { in: [winnerId, loserId] } },
            data: {
                totalMatches: { increment: 1 },
            },
        });

        await prisma.user.update({
            where: { id: winnerId },
            data: {
                wins: { increment: 1 },
            },
        });

        await prisma.user.update({
            where: { id: loserId },
            data: {
                losses: { increment: 1 },
            },
        });

        reply.send({ message: 'Match result updated & stats saved.', matchId });
    } catch (err) {
        console.error(err);
        reply.status(500).send({ error: 'Failed to update match result.' });
    }
};


export default {
    createMatch,
    updateResult,
};
