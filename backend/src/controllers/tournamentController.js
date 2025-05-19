import prisma from '../db/prisma.js';
import socketController from './socketController.js';

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

    if (isNaN(userId) || isNaN(tournamentId)) {
        return reply.status(400).send({ error: 'Invalid userId or tournamentId' });
    }

    console.log('User ID:', userId);

    const tournament = await prisma.tournament.findUnique({
        where: { id: tournamentId }
    });

    if (tournament?.currentRound !== null && tournament.currentRound > 0) {
        return reply.status(400).send({ error: 'Tournament already started' });
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

    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

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
    });

    if (participants.length % 2 !== 0)
        return reply.status(400).send({ error: 'Number of players must be even' });

    const shuffled = participants.sort(() => Math.random() - 0.5);

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

    const firstMatch = await prisma.tournamentMatch.findFirst({
        where: { tournamentId, round: 1 },
        orderBy: { matchOrder: 'asc' },
        include: {
            player1: {
                include: {
                    user: { select: { avatarUrl: true, username: true } }
                }
            },
            player2: {
                include: {
                    user: { select: { avatarUrl: true, username: true } }
                }
            },
        },
    });

    await socketController.broadcastStartToTournament(tournamentId, {
        player1Id: firstMatch.player1.userId,
        player2Id: firstMatch.player2.userId,
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
        include: {
            player1: {
                include: {
                    user: { select: { avatarUrl: true, username: true } }
                }
            },
            player2: {
                include: {
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
        const match = await prisma.tournamentMatch.update({
            where: { id: matchId },
            data: { winnerId: parseInt(winnerId), playedAt: new Date() },
            include: {
                player1: { include: { user: true } },
                player2: { include: { user: true } },
                winner: { include: { user: true } },
            },
        });
        
        const userWinnerId = match.winner.user.id;
        const userLoserId =
        match.player1.userId === parseInt(winnerId)
        ? match.player2.user.id
        : match.player1.user.id;
        
        await prisma.user.updateMany({
            where: { id: { in: [userWinnerId, userLoserId] } },
            data: {
                totalMatches: { increment: 1 },
            },
        });
        
        await prisma.user.update({
            where: { id: userWinnerId },
            data: {
                wins: { increment: 1 },
            },
        });
        
        await prisma.user.update({
            where: { id: userLoserId },
            data: {
                losses: { increment: 1 },
            },
        });
        
        const remaining = await prisma.tournamentMatch.count({
            where: {
                tournamentId,
                round: match.round,
                winnerId: null
            }
        });
        
        if (remaining === 0) {

            const winners = await prisma.tournamentMatch.findMany({
                where: {
                    tournamentId,
                    round: match.round
                },
                select: {
                    winnerId: true
                }
            });
            const winnerIds = winners.map(w => w.winnerId).filter(Boolean);
            
            if (winnerIds.length === 1) {
                await prisma.tournament.update({
                    where: { id: tournamentId },
                    data: { currentRound: match.round + 1 }
                });
                return reply.send({ message: 'Tournament finished!', championId: winnerIds[0] });
            }
            
            const shuffled = winnerIds.sort(() => Math.random() - 0.5);

            for (let i = 0; i < shuffled.length; i += 2) {
                await prisma.tournamentMatch.create({
                    data: {
                        tournamentId,
                        round: match.round + 1,
                        matchOrder: i / 2 + 1,
                        player1Id: shuffled[i],
                        player2Id: shuffled[i + 1],
                    },
                });
            }
            
            await prisma.tournament.update({
                where: { id: tournamentId },
                data: { currentRound: match.round + 1 }
            });
        }
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
                select: { alias: true },
                include: {
                    user: { select: { avatarUrl: true, username: true } }
                }
            },
            player2: {
                select: { alias: true },
                include: {
                    user: { select: { avatarUrl: true, username: true } }
                }
            },
            winner: { select: { alias: true } },
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
