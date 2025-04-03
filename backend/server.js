import Fastify from 'fastify';
import jwt from '@fastify/jwt';
import formbody from '@fastify/formbody';
import 'dotenv/config';

import authRoutes from './routes/auth.js';

const fastify = Fastify({ logger: true });

fastify.register(formbody);
fastify.register(jwt, {
  secret: process.env.JWT_SECRET,
});

fastify.register(authRoutes, { prefix: '/auth' });

fastify.listen({ port: 3000 }, (err) => {
  if (err) throw err;
});

export const app = fastify;