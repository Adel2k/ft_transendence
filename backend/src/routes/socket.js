import socketController from '../controllers/socketController.js';

export default async function socketRoutes(fastify) {
  fastify.get('/ws', { websocket: true }, socketController.handleConnection(fastify));
  fastify.get('/ws/match/:matchId', { websocket: true }, socketController.handleMatchSocket(fastify));

  fastify.post('/ws/tournament/redirect', async (req, reply) => {
    const { userIds, url } = req.body;
    await socketController.broadcastRedirect( userIds, url);
    reply.send({ ok: true });
  });
}