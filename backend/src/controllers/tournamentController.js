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
const startTournament = async (req, reply) => {
    const { id } = req.params;
    const tournamentId = parseInt(id);
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length < 2 || userIds.length % 2 !== 0) {
        return reply.status(400).send({ error: 'Provide an even number of userIds (at least 2).' });
    }

    const onlineUsers = socketController.getOnlineUsers();
    for (const userId of userIds) {
        if (!onlineUsers.has(userId)) {
            return reply.status(403).send({ error: `User ${userId} must be online to join the tournament.` });
        }
    }

    const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, username: true, avatarUrl: true },
    });

    if (users.length !== userIds.length) {
        return reply.status(404).send({ error: 'One or more users not found.' });
    }

    const shuffled = fisherYatesShuffle([...users]);

    const matchCreations = [];
    for (let i = 0; i < shuffled.length; i += 2) {
        matchCreations.push(
            prisma.tournamentMatch.create({
                data: {
                    tournamentId,
                    round: 1,
                    matchOrder: i / 2 + 1,
                    player1Id: shuffled[i].id,
                    player2Id: shuffled[i + 1].id,
                },
            })
        );
    }

    const participantCreations = userIds.map(userId =>
        prisma.tournamentParticipant.create({
            data: {
                tournamentId,
                userId,
            }
        })
    );

    await prisma.$transaction([
        prisma.tournament.update({
            where: { id: tournamentId },
            data: { currentRound: 1 },
        }),
        ...participantCreations,
        ...matchCreations
    ]);

    await socketController.broadcastStartToTournament(userIds, {
        player1Id: shuffled[0].id,
        player2Id: shuffled[1].id,
        tournamentId: tournamentId,
    });

    reply.send({ message: 'Tournament started!' });
};

const getNextMatch = async (req, reply) => {
    const { id } = req.params;
    const tournamentId = parseInt(id);

    const match = await prisma.tournamentMatch.findFirst({
        where: {
            tournamentId,
            winnerId: null,
        },
        orderBy: [
            { round: 'asc' },
            { matchOrder: 'asc' },
        ],
        include: {
            player1: {
                select: {
                    id: true,
                    username: true,
                    avatarUrl: true,
                }
            },
            player2: {
                select: {
                    id: true,
                    username: true,
                    avatarUrl: true,
                }
            },
        },
    });

    const tournamentParticipants = await prisma.tournamentParticipant.findMany({
        where: { tournamentId },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    avatarUrl: true,
                }
            }
        }
    });

    const participants = tournamentParticipants.map(tp => tp.user);

    reply.send({
        match: match || null,
        participants
    });
};

const submitMatchResult = async (req, reply) => {
    const { id, mid } = req.params;
    const { winnerId } = req.body;
    const tournamentId = parseInt(id);
    const matchId = parseInt(mid);

    try {
        const existing = await prisma.tournamentMatch.findUnique({
            where: { id: matchId },
            select: { winnerId: true, player1Id: true, player2Id: true }
        });

        if (existing?.winnerId) {
            return reply.status(400).send({ error: 'Match result already submitted' });
        }

        if (![existing.player1Id, existing.player2Id].includes(parseInt(winnerId))) {
            return reply.status(400).send({ error: 'Winner must be one of the two match players' });
        }

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
                    winner: { select: { id: true } }
                }
            });

            const winnerIds = winners.map(w => w.winner?.id).filter(Boolean);

            if (winnerIds.length === 1) {
                await prisma.tournament.update({
                    where: { id: match.tournamentId },
                    data: { currentRound: match.round + 1 }
                });
                return reply.send({ message: 'Tournament finished!', championId: winnerIds[0] });
            }

            const uniqueWinners = [...new Set(winnerIds)];

            if (uniqueWinners.length % 2 !== 0) {
                return reply.status(400).send({ error: 'Odd number of unique winners. Cannot pair up evenly.' });
            }

            const shuffled = fisherYatesShuffle([...uniqueWinners]);

            for (let i = 0; i < shuffled.length; i += 2) {
                if (shuffled[i] === shuffled[i + 1]) {
                    return reply.status(500).send({ error: 'Cannot create match with the same user for both players.' });
                }

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
            player1: { select: { id: true, username: true, avatarUrl: true } },
            player2: { select: { id: true, username: true, avatarUrl: true } },
            winner:  { select: { id: true, username: true } },
        },
    });

    reply.send(matches);
};

export default {
    createTournament,
    startTournament,
    getNextMatch,
    submitMatchResult,
    getBracket,
};
