import userController from '../controllers/userController.js';

async function userRoutes(fastify, options) {
    fastify.get('/me', {
        preValidation: [fastify.authenticate],
        handler: userController.me
    });

    fastify.patch('/avatar', {
        preValidation: [fastify.authenticate],
        handler: userController.updateAvatar,
    });

    fastify.post('/friends/:friendId', {
        preValidation: [fastify.authenticate],
        handler: userController.addFriend,
    });

    fastify.get('/friends', {
        preValidation: [fastify.authenticate],
        handler: userController.listFriends,
    });

}

export default userRoutes;
