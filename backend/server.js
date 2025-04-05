import Fastify from 'fastify';
import formbody from '@fastify/formbody';
import 'dotenv/config';

import jwtPlugin from './plugins/jwt.js';
import registerRoutes from './routes/index.js';

const fastify = Fastify({logger: true});

fastify.register(formbody);
fastify.register(jwtPlugin);
fastify.register(registerRoutes);

fastify.listen({port: 3000}, (err) => {
    if (err) throw err;
});

export const app = fastify;
