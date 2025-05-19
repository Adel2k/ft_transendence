import { OAuth2Client } from 'google-auth-library';
import prisma from '../db/prisma.js';
import { app } from '../server.js';
import { generateRandomAvatar } from '../utils/avatar.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateUsername = (email) => {
  const prefix = email.split('@')[0];
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  return `${prefix}_${randomSuffix}`;
};

const googleSignIn = async (req, reply) => {
  const { token } = req.body;

  if (!token) return reply.status(400).send({ error: 'Missing Google token' });

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    let user = await prisma.user.findUnique({ where: { googleId: sub } });

    if (!user) {
      user = await prisma.user.findUnique({ where: { email } });

      if (user) {
        user = await prisma.user.update({
          where: { email },
          data: {
            googleId: sub,
          },
        });
      } else {
        const username = generateUsername(email);
        user = await prisma.user.create({
          data: {
            email,
            username,
            googleId: sub,
            avatarUrl: picture || generateRandomAvatar(username),
          },
        });
      }
    }

    const jwt = await app.jwt.sign({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    reply.send({ token: jwt });
  } catch (err) {
    console.error('Google sign-in error:', err);
    reply.status(500).send({ error: 'Authentication failed' });
  }
};

export default { googleSignIn };
