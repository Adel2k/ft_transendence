import prisma from '../db/prisma.js';
import socketController from './socketController.js';

function fisherYatesShuffle(array) {
    let m = array.length;
    while (m) {
        const i = Math.floor(Math.random() * m--);
        [array[m], array[i]] = [array[i], array[m]];
    }
    return array;
}

const createTournament = async (req, reply) => {
    const { name } = req.body;
    const tournament = await prisma.tournament.create({
        data: {
            name,
            currentRound: 0,
        },
    });
    reply.send(tournament);
};

const joinTournament = async (req, reply) => {
    const { id } = req.params;
    let { userId } = req.body;

    userId = Number(userId);
    const tournamentId = Number(id);

    if (!Number.isInteger(userId) || !Number.isInteger(tournamentId)) {
        return reply.status(400).send({ error: 'Invalid userId or tournamentId' });
    }

    const tournament = await prisma.tournament.findUnique({
        where: { id: tournamentId }
    });

    if (!tournament || tournament.currentRound > 0) {
        return reply.status(400).send({ error: 'Tournament already started or not found' });
    }

    const onlineUsers = socketController.getOnlineUsers();
    if (!onlineUsers.has(userId)) {
        return reply.status(403).send({ error: 'User must be online to join the tournament' });
    }

    const existing = await prisma.tournamentParticipant.findFirst({
        where: { userId, tournamentId },
    });

    if (existing) {
        return reply.status(400).send({ error: 'User has already joined the tournament' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        return reply.status(404).send({ error: 'User not found' });
    }

    const participant = await prisma.tournamentParticipant.create({
        data: {
            alias: user.username,
            tournamentId,
            userId,
        },
    });

    reply.send(participant);
};

const listParticipants = async (req, reply) => {
    const { id } = req.params;
    const participants = await prisma.tournamentParticipant.findMany({
        where: { tournamentId: parseInt(id) },
        select: { id: true, alias: true },
    });
    reply.send(participants);
};

const startTournament = async (req, reply) => {
    const { id } = req.params;
    const tournamentId = parseInt(id);

    const participants = await prisma.tournamentParticipant.findMany({
        where: { tournamentId },
        include: {
            user: {
                select: { id: true, username: true, avatarUrl: true },
            },
        },
    });

    if (participants.length % 2 !== 0)
        return reply.status(400).send({ error: 'Number of players must be even' });

    const shuffled = fisherYatesShuffle([...participants]);

    for (let i = 0; i < shuffled.length; i += 2) {
        await prisma.tournamentMatch.create({
            data: {
                tournamentId,
                round: 1,
                matchOrder: i / 2 + 1,
                player1Id: shuffled[i].id,
                player2Id: shuffled[i + 1].id,
            },
        });
    }

    await prisma.tournament.update({
        where: { id: tournamentId },
        data: { currentRound: 1 },
    });

    await socketController.broadcastStartToTournament(tournamentId, {
        player1Id: shuffled[0].user.id,
        player2Id: shuffled[1].user.id,
    });

    reply.send({ message: 'Tournament started!' });
};

const getNextMatch = async (req, reply) => {
    const { id } = req.params;
    const match = await prisma.tournamentMatch.findFirst({
        where: {
            tournamentId: parseInt(id),
            winnerId: null,
        },
        orderBy: [
            { round: 'asc' },
            { matchOrder: 'asc' },
        ],
        select: {
            id: true,
            tournamentId: true,
            player1: {
                select: {
                    userId: true,
                    alias: true,
                    user: { select: { avatarUrl: true, username: true } }
                }
            },
            player2: {
                select: {
                    userId: true,
                    alias: true,
                    user: { select: { avatarUrl: true, username: true } }
                }
            },
        },
    });

    reply.send(match || { message: 'No pending matches' });
};

const submitMatchResult = async (req, reply) => {
    const { id, mid } = req.params;
    const { winnerId } = req.body;
    const tournamentId = parseInt(id);
    const matchId = parseInt(mid);

    try {
        const existing = await prisma.tournamentMatch.findUnique({ where: { id: matchId } });
        if (existing?.winnerId)
            return reply.status(400).send({ error: 'Match result already submitted' });

        const match = await prisma.tournamentMatch.update({
            where: { id: matchId },
            data: { winnerId: parseInt(winnerId), playedAt: new Date() },
            select: {
                id: true,
                round: true,
                tournamentId: true,
            },
        });

        const remaining = await prisma.tournamentMatch.count({
            where: {
                tournamentId: match.tournamentId,
                round: match.round,
                winnerId: null
            }
        });

        if (remaining === 0) {
            const winners = await prisma.tournamentMatch.findMany({
                where: {
                    tournamentId: match.tournamentId,
                    round: match.round
                },
                select: {
                    winner: {
                        select: {
                            id: true,
                            userId: true
                        }
                    }
                }
            });

            const winnerParticipants = winners.map(w => w.winner).filter(Boolean);
            const winnerParticipantIds = winnerParticipants.map(p => p.id);

            if (winnerParticipantIds.length === 1) {
                await prisma.tournament.update({
                    where: { id: match.tournamentId },
                    data: { currentRound: match.round + 1 }
                });
                return reply.send({ message: 'Tournament finished!', championId: winnerParticipants[0].userId });
            }

            const shuffled = fisherYatesShuffle([...winnerParticipantIds]);

            for (let i = 0; i < shuffled.length; i += 2) {
                await prisma.tournamentMatch.create({
                    data: {
                        tournamentId: match.tournamentId,
                        round: match.round + 1,
                        matchOrder: i / 2 + 1,
                        player1Id: shuffled[i],
                        player2Id: shuffled[i + 1],
                    },
                });
            }

            await prisma.tournament.update({
                where: { id: match.tournamentId },
                data: { currentRound: match.round + 1 }
            });
        }

        return reply.send({ message: 'Match result submitted successfully!' });
    } catch (err) {
        console.error(err);
        reply.status(500).send({ error: 'Failed to submit tournament match result.' });
    }
};

const getBracket = async (req, reply) => {
    const { id } = req.params;
    const matches = await prisma.tournamentMatch.findMany({
        where: { tournamentId: parseInt(id) },
        orderBy: [
            { round: 'asc' },
            { matchOrder: 'asc' },
        ],
        include: {
            player1: {
                select: {
                    alias: true,
                    user: { select: { avatarUrl: true, username: true } },
                },
            },
            player2: {
                select: {
                    alias: true,
                    user: { select: { avatarUrl: true, username: true } },
                },
            },
            winner: {
                select: { alias: true },
            },
        },
    });

    reply.send(matches);
};

export default {
    createTournament,
    joinTournament,
    listParticipants,
    startTournament,
    getNextMatch,
    submitMatchResult,
    getBracket,
};
