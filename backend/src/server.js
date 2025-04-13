import Fastify from 'fastify';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

import jwtPlugin from './plugins/jwt.js';
import registerRoutes from './routes/index.js';
import formbody from '@fastify/formbody';

const fastify = Fastify({
    logger: true,
    https: {
        key: fs.readFileSync(path.resolve(process.env.HTTPS_KEY)),
        cert: fs.readFileSync(path.resolve(process.env.HTTPS_CERT)),
    },
});

fastify.register(formbody);
fastify.register(jwtPlugin);
fastify.register(registerRoutes);

fastify.listen({
    port: 3000,
    host: '0.0.0.0'
}, (err) => {
    if (err) throw err;
});

export const app = fastify;
