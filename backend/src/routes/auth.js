import authController from '../controllers/authController.js';

async function authRoutes(fastify, options) {
    fastify.post('/register', authController.register);
    fastify.post('/login', authController.login);
    fastify.post('/2fa-verify', authController.verify2FAAfterLogin);
}

export default authRoutes;
