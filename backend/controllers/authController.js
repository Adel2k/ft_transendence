import bcrypt from 'bcrypt';
import prisma from '../db/prisma.js';
import { app } from '../server.js';

const SALT_ROUNDS = 10;

const register = async (req, reply) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password)
    return reply.status(400).send({ error: 'All fields are required.' });

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    reply.code(201).send({ message: 'User registered successfully!' });
  } catch (err) {
    if (err.code === 'P2002') {
      reply.status(409).send({ error: 'Email or username already in use.' });
    } else {
      reply.status(500).send({ error: 'Registration failed.' });
    }
  }
};

const login = async (req, reply) => {
  const { email, password } = req.body;

  if (!email || !password)
    return reply.status(400).send({ error: 'Email and password required.' });

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user)
      return reply.status(401).send({ error: 'Invalid email or password.' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return reply.status(401).send({ error: 'Invalid email or password.' });

    // Future 2FA check goes here
    const token = await app.jwt.sign({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    reply.send({ token });
  } catch (err) {
    console.error(err);
    reply.status(500).send({ error: 'Login failed.' });
  }
};

export default {
  register,
  login,
};
