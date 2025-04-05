const me = async (req, reply) => {
	const user = req.user;
	reply.send({ user });
};

export default {
	me,
};
