import prisma from '../db/prisma.js';
import socketController from './socketController.js';

const createTournament = async (req, reply) => {
    const { name } = req.body;
    const tournament = await prisma.tournament.create({
        data: { name },
    });
    reply.send(tournament);
};

const joinTournament = async (req, reply) => {
    const { id } = req.params;
    const { alias } = req.body;
    const userId = req.user.id;

    const tournament = await prisma.tournament.findUnique({
        where: { id: parseInt(id) }
    });
    if (tournament.currentRound > 0) {
        return reply.status(400).send({ error: 'Tournament already started' });
    }

    const onlineUsers = socketController.getOnlineUsers();
    if (!onlineUsers.has(userId)) {
        return reply.status(403).send({ error: 'You must be online to join the tournament' });
    }

    const existing = await prisma.tournamentParticipant.findFirst({
        where: { userId, tournamentId: parseInt(id) },
    });

    if (existing)
        return reply.status(400).send({ error: 'Already joined' });

    const participant = await prisma.tournamentParticipant.create({
        data: {
            alias,
            tournamentId: parseInt(id),
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
            player1: true,
            player2: true,
        },
    });

    reply.send(match || { message: 'No pending matches' });
};

const submitMatchResult = async (req, reply) => {
    const { id, mid } = req.params;
    const { winnerId } = req.body;

    const match = await prisma.tournamentMatch.update({
        where: { id: parseInt(mid) },
        data: { winnerId: parseInt(winnerId), playedAt: new Date() },
    });

    reply.send({ message: 'Match result submitted', match });

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
            player1: { select: { alias: true } },
            player2: { select: { alias: true } },
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
