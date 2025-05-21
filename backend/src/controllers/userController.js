import prisma from '../db/prisma.js';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import socketController from './socketController.js';
import { generateRandomAvatar } from '../utils/avatar.js';

const me = async (req, reply) => {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            username: true,
            avatarUrl: true,
        },
    });

    if (!user) {
        return reply.status(404).send({ error: 'User not found' });
    }

    const matchWins = await prisma.match.count({
        where: { winnerId: userId },
    });

    const matchLosses = await prisma.match.count({
        where: {
            winnerId: { not: userId },
            OR: [
                { player1Id: userId },
                { player2Id: userId },
            ],
        },
    });

    const tournamentWins = await prisma.tournamentMatch.count({
        where: {
            winnerId: userId,
        },
    });

    const tournamentLosses = await prisma.tournamentMatch.count({
        where: {
            winnerId: {
                not: userId,
            },
            AND: {
                OR: [
                    { player1Id: userId },
                    { player2Id: userId },
                ],
            },
        },
    });


    const totalWins = matchWins + tournamentWins;
    const totalLosses = matchLosses + tournamentLosses;
    const totalMatches = totalWins + totalLosses;

    reply.send({
        user: {
            ...user,
            wins: totalWins,
            losses: totalLosses,
            totalMatches,
        },
    });
};

const uploadAvatar = async (req, reply) => {
    const userId = req.user.id;
    const data = await req.file();

    if (!data || !data.filename) {
        return reply.status(400).send({ error: 'No file uploaded' });
    }

    const ext = path.extname(data.filename);
    const uniqueName = crypto.randomUUID() + ext;
    const filename = uniqueName;
    const savePath = `/app/public/avatars/${filename}`;
    const publicUrl = `/avatars/${filename}`;

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (user.avatarUrl?.startsWith('/avatars/')) {
            const oldFile = path.join('/app/public', user.avatarUrl);
            try {
                await fs.unlink(oldFile);
            } catch (e) {
                console.warn(`Old avatar not found or already deleted: ${oldFile}`);
            }
        }

        await fs.mkdir('/app/public/avatars', { recursive: true });
        await fs.writeFile(savePath, await data.toBuffer());

        const updated = await prisma.user.update({
            where: { id: userId },
            data: { avatarUrl: publicUrl },
        });

        reply.send({ message: 'Avatar uploaded', avatarUrl: updated.avatarUrl });
    } catch (err) {
        console.error(err);
        reply.status(500).send({ error: 'Failed to upload avatar' });
    }
};

const updateAvatar = async (req, reply) => {
    const userId = req.user.id;
    const { avatarUrl } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user)
            return reply.status(404).send({ error: 'User not found.' });

        if (
            user.avatarUrl?.startsWith('/avatars/') &&
            (!avatarUrl || avatarUrl.startsWith('http'))
        ) {
            const oldFile = path.join('/app/public', user.avatarUrl);
            try {
                await fs.unlink(oldFile);
            } catch (e) {
                console.warn(`Old avatar not found or already deleted: ${oldFile}`);
            }
        }

        const newAvatar =
            avatarUrl && avatarUrl.trim() !== ''
                ? avatarUrl
                : generateRandomAvatar(user.username);

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
                isOnline: socketController.isUserOnline(friend.id),
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
    const regularMatches = await prisma.match.findMany({
      where: {
        OR: [{ player1Id: userId }, { player2Id: userId }],
      },
      include: {
        player1: true,
        player2: true,
        winner: true,
      },
      orderBy: { playedAt: 'desc' },
    });

    const regularHistory = regularMatches.map((match) => {
      const isWinner = match.winnerId === userId;
      const opponent =
        match.player1Id === userId ? match.player2 : match.player1;

      return {
        id: match.id,
        opponent: opponent?.username || 'Unknown',
        opponentAvatar: opponent?.avatarUrl || '',
        result: isWinner ? 'win' : 'loss',
        playedAt: match.playedAt,
        type: 'casual',
      };
    });

    const tournamentMatches = await prisma.tournamentMatch.findMany({
      where: {
        OR: [{ player1Id: userId }, { player2Id: userId }],
      },
      include: {
        player1: true,
        player2: true,
        winner: true,
        tournament: true,
      },
      orderBy: { playedAt: 'desc' },
    });

    const tournamentHistory = tournamentMatches.map((match) => {
      const isWinner = match.winnerId === userId;
      const opponent =
        match.player1Id === userId ? match.player2 : match.player1;

      return {
        id: match.id,
        opponent: opponent?.username || 'Unknown',
        opponentAvatar: opponent?.avatarUrl || '',
        result: isWinner ? 'win' : 'loss',
        playedAt: match.playedAt,
        type: 'tournament',
        tournamentName: match.tournament?.name || 'Unknown Tournament',
      };
    });

    const fullHistory = [...regularHistory, ...tournamentHistory].sort(
      (a, b) => new Date(b.playedAt) - new Date(a.playedAt)
    );

    reply.send({ history: fullHistory });
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
    uploadAvatar,
    updateAvatar,
    addFriend,
    listFriends,
    getMatchHistory,
    updateUsername
};
