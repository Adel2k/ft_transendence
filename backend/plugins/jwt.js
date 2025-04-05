import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';

async function jwtPlugin(fastify, opts) {
	fastify.register(jwt, {
		secret: process.env.JWT_SECRET,
	});

	fastify.decorate('authenticate', async function (request, reply) {
		try {
			await request.jwtVerify();
		} catch (err) {
			reply.send(err);
		}
	});
}

export default fp(jwtPlugin);
