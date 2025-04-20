import bcrypt from 'bcryptjs';
import prisma from '../db/prisma.js';
import {app} from '../server.js';
import speakeasy from 'speakeasy';
import { validateEmail, validatePassword } from '../utils/validators.js';

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);
const AVATAR_BASE = process.env.DEFAULT_AVATAR;

const register = async (req, reply) => {
    const { email, username, password, avatarUrl } = req.body;

    if (!email || !username || !password) {
        return reply.status(400).send({ error: 'All fields are required.' });
    }

    if (!validateEmail(email)) {
        return reply.status(400).send({ error: 'Invalid email format.' });
    }

    if (!validatePassword(password)) {
        return reply.status(400).send({ error: 'Password must be at least 8 characters and include one uppercase letter.' });
    }

    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }],
            },
        });

        if (existingUser) {
            return reply.status(409).send({ error: 'Email or username already in use.' });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                avatarUrl: avatarUrl || `${AVATAR_BASE}${encodeURIComponent(username)}?bgset=bg1`,
            },
        });

        reply.code(201).send({ message: 'User registered successfully!' });
    } catch (err) {
        console.error(err);
        reply.status(500).send({ error: 'Registration failed.' });
    }
};

const login = async (req, reply) => {
    const { email, password } = req.body;

    if (!email || !password)
        return reply.status(400).send({ error: 'Email and password required.' });

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password)))
            return reply.status(401).send({ error: 'Invalid email or password.' });

        if (user.is2faEnabled) {
            const tempToken = await app.jwt.sign(
                { id: user.id, twofa: true },
                { expiresIn: '5m' }
            );

            return reply.send({ message: '2FA required.', tempToken });
        }

        const token = await app.jwt.sign(
            {
                id: user.id,
                email: user.email,
                username: user.username,
            },
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        reply.send({ token });
    } catch (err) {
        console.error(err);
        reply.status(500).send({ error: 'Login failed.' });
    }
};

const verify2FAAfterLogin = async (req, reply) => {
    const { token: tempToken, code } = req.body;

    if (!tempToken || !code)
        return reply.status(400).send({ error: 'Token and code required.' });

    try {
        const decoded = await app.jwt.verify(tempToken);

        if (!decoded.twofa || !decoded.id)
            return reply.status(401).send({ error: 'Invalid 2FA token.' });

        const user = await prisma.user.findUnique({ where: { id: decoded.id } });

        if (!user || !user.is2faEnabled || !user.twofaSecret)
            return reply.status(401).send({ error: '2FA not set up.' });

        const valid = speakeasy.totp.verify({
            secret: user.twofaSecret,
            encoding: 'base32',
            token: code,
        });

        if (!valid)
            return reply.status(401).send({ error: 'Invalid 2FA code.' });

        const fullToken = await app.jwt.sign(
            {
                id: user.id,
                email: user.email,
                username: user.username,
            },
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        reply.send({ token: fullToken });
    } catch (err) {
        console.error(err);
        reply.status(500).send({ error: '2FA verification failed.' });
    }
};

export default {
    register,
    login,
    verify2FAAfterLogin
};
