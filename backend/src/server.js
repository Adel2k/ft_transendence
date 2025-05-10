import Fastify from 'fastify';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'url';
import websocket from '@fastify/websocket';

import jwtPlugin from './plugins/jwt.js';
import registerRoutes from './routes/index.js';
import formbody from '@fastify/formbody';
import dotenv from 'dotenv';
dotenv.config();

const fastify = Fastify({
    logger: true,
    https: {
        key: fs.readFileSync(path.resolve(process.env.HTTPS_KEY)),
        cert: fs.readFileSync(path.resolve(process.env.HTTPS_CERT)),
    },
});

fastify.register(formbody);
fastify.register(websocket);
fastify.register(multipart);
fastify.register(jwtPlugin);
fastify.register(registerRoutes);

fastify.register(fastifyStatic, {
    root: path.join(fileURLToPath(import.meta.url), '../../public'),
    prefix: '/',
  });

fastify.listen({
    port: 3000,
    host: '0.0.0.0'
}, (err) => {
    if (err) throw err;
});

export const app = fastify;
