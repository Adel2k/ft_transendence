import matchController from '../controllers/matchController.js';

export default async function matchRoutes(fastify, opts) {
    fastify.post('/create', {
        preValidation: [fastify.authenticate],
        handler: matchController.createMatch,
    });

    fastify.patch('/:matchId/result', {
        preValidation: [fastify.authenticate],
        handler: matchController.updateResult,
    });
}
