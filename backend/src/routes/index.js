import authRoutes from './auth.js';
import userRoutes from './user.js';
import matchRoutes from './match.js';
import twofaRoutes from './2fa.js';

export default async function registerRoutes(fastify, opts) {
    fastify.register(authRoutes, {prefix: '/auth'});
    fastify.register(userRoutes, {prefix: '/user'});
    fastify.register(matchRoutes, {prefix: '/match'});
    fastify.register(twofaRoutes, { prefix: '/2fa' });
}
