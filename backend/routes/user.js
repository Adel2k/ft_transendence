import userController from '../controllers/userController.js';

async function userRoutes(fastify, options) {
    fastify.get('/me', {preValidation: [fastify.authenticate]}, userController.me);

    fastify.patch('/avatar', {
        preValidation: [fastify.authenticate], handler: userController.updateAvatar,
    });
}

export default userRoutes;
