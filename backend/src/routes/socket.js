import socketController from '../controllers/socketController.js';

export default async function socketRoutes(fastify) {
  fastify.get('/ws', { websocket: true }, socketController.handleConnection(fastify));
}