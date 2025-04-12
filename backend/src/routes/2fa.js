import twofaController from '../controllers/twofaController.js';

export default async function twofaRoutes(fastify, opts) {
    fastify.get('/on', {
        preValidation: [fastify.authenticate],
        handler: twofaController.generate2FASetup,
    });

    fastify.post('/on', {
        preValidation: [fastify.authenticate],
        handler: twofaController.enable2FA,
    });

    fastify.post('/off', {
        preValidation: [fastify.authenticate],
        handler: twofaController.disable2FA,
    });
}
