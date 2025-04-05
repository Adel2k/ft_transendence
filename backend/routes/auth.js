import authController from '../controllers/authController.js';

async function authRoutes(fastify, options) {
    fastify.post('/register', authController.register);
    fastify.post('/login', authController.login);
}

export default authRoutes;
