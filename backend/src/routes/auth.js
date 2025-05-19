import authController from '../controllers/authController.js';
import googleController from '../controllers/googleController.js';

async function authRoutes(fastify, options) {
    fastify.post('/register', authController.register);
    fastify.post('/login', authController.login);
    fastify.post('/2fa-verify', authController.verify2FAAfterLogin);
    fastify.post('/google-signin', googleController.googleSignIn);
}

export default authRoutes;
