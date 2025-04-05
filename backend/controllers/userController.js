import prisma from '../db/prisma.js';

const me = async (req, reply) => {
    const user = await prisma.user.findUnique({
        where: {id: req.user.id},
        select: {
            id: true,
            email: true,
            username: true,
            avatarUrl: true,
        },
    });

    reply.send({user});
};

const updateAvatar = async (req, reply) => {
    const userId = req.user.id;
    const {avatarUrl} = req.body;

    try {
        const user = await prisma.user.findUnique({where: {id: userId}});

        if (!user)
            return reply.status(404).send({error: 'User not found.'});

        const newAvatar =
            avatarUrl && avatarUrl.trim() !== ''
                ? avatarUrl
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}`;

        const updatedUser = await prisma.user.update({
            where: {id: userId},
            data: {avatarUrl: newAvatar},
        });

        reply.send({
            message: 'Avatar updated.',
            avatarUrl: updatedUser.avatarUrl,
        });
    } catch (err) {
        console.error(err);
        reply.status(500).send({error: 'Failed to update avatar.'});
    }
};

const addFriend = async (req, reply) => {
    const userId = req.user.id;
    const friendId = parseInt(req.params.friendId);

    if (userId === friendId)
        return reply.status(400).send({error: "You can't friend yourself."});

    try {
        const existing = await prisma.friendship.findFirst({
            where: {
                OR: [
                    {userId, friendId},
                    {userId: friendId, friendId: userId},
                ],
            },
        });

        if (existing)
            return reply.status(400).send({error: "You're already friends."});

        await prisma.friendship.create({
            data: {userId, friendId},
        });

        reply.send({message: "Friend added."});
    } catch (err) {
        console.error(err);
        reply.status(500).send({error: 'Failed to add friend.'});
    }
};

const listFriends = async (req, reply) => {
    const userId = req.user.id;

    try {
        const friendships = await prisma.friendship.findMany({
            where: {
                OR: [
                    {userId},
                    {friendId: userId},
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

        reply.send({friends});
    } catch (err) {
        console.error(err);
        reply.status(500).send({error: 'Failed to get friends list.'});
    }
};

export default {
    me,
    updateAvatar,
    addFriend,
    listFriends
};
