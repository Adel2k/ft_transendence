import userController from '../controllers/userController.js';

async function userRoutes(fastify, options) {
	fastify.get('/me', { preValidation: [fastify.authenticate] }, userController.me);
}

export default userRoutes;
