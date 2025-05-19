import socketController from '../controllers/socketController.js';

export default async function socketRoutes(fastify) {
  fastify.get('/ws', { websocket: true }, socketController.handleConnection(fastify));
  fastify.get('/ws/match/:matchId', { websocket: true }, socketController.handleMatchSocket(fastify));
  fastify.post('/ws/tournament/:tournamentId/end', async (req, reply) => {
    const { tournamentId } = req.params;
    await socketController.broadcastTournamentEnd(Number(tournamentId));
    reply.send({ ok: true });
  });
}