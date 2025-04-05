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

export default {
    me,
    updateAvatar,
};
