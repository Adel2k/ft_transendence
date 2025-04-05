import prisma from '../db/prisma.js';

const me = async (req, reply) => {
	const user = await prisma.user.findUnique({
		where: { id: req.user.id },
		select: {
			id: true,
			email: true,
			username: true,
			avatarUrl: true,
		},
	});

	reply.send({ user });
};

export default {
	me,
};
