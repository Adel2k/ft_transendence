import twofaController from '../controllers/twofaController.js';

export default async function twofaRoutes(fastify, opts) {
    fastify.get('/setup', {
        preValidation: [fastify.authenticate],
        handler: twofaController.generate2FA,
    });

    fastify.post('/verify', {
        preValidation: [fastify.authenticate],
        handler: twofaController.verify2FA,
    });

    fastify.post('/toggle', {
        preValidation: [fastify.authenticate],
        handler: twofaController.toggle2FA,
    });
}
