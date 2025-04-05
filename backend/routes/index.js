import authRoutes from './auth.js';
import userRoutes from './user.js';

export default async function registerRoutes(fastify, opts) {
    fastify.register(authRoutes, {prefix: '/auth'});
    fastify.register(userRoutes, {prefix: '/user'});
}
