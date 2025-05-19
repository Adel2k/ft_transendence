import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import prisma from '../db/prisma.js';

const generate2FASetup = async (req, reply) => {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (user.googleId)
        return reply.status(403).send({ error: '2FA is not allowed for Google Sign-In users.' });

    if (user.is2faEnabled)
        return reply.status(400).send({ error: '2FA is already enabled.' });

    const secret = speakeasy.generateSecret({
        name: `ft_transcendence (${user.username})`,
    });

    await prisma.user.update({
        where: { id: user.id },
        data: {
            twofaSecret: secret.base32,
        },
    });

    const qrData = await qrcode.toDataURL(secret.otpauth_url);

    reply.send({
        message: 'Scan the QR with Google Authenticator',
        qr: qrData,
        base32: secret.base32,
    });
};

const enable2FA = async (req, reply) => {
    const { code } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (user.googleId)
        return reply.status(403).send({ error: '2FA is not allowed for Google Sign-In users.' });

    if (user.is2faEnabled)
        return reply.status(400).send({ error: '2FA is already enabled.' });

    const verified = speakeasy.totp.verify({
        secret: user.twofaSecret,
        encoding: 'base32',
        token: code,
    });

    if (!verified)
        return reply.status(401).send({ error: 'Invalid 2FA code.' });

    await prisma.user.update({
        where: { id: user.id },
        data: {
            is2faEnabled: true,
        },
    });

    reply.send({ message: '2FA enabled successfully.' });
};

const disable2FA = async (req, reply) => {
    const { code } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (user.googleId)
        return reply.status(403).send({ error: '2FA is not allowed for Google Sign-In users.' });

    if (!user.is2faEnabled)
        return reply.status(400).send({ error: '2FA is not enabled.' });

    const verified = speakeasy.totp.verify({
        secret: user.twofaSecret,
        encoding: 'base32',
        token: code,
    });

    if (!verified)
        return reply.status(401).send({ error: 'Invalid 2FA code.' });

    await prisma.user.update({
        where: { id: user.id },
        data: {
            is2faEnabled: false,
            twofaSecret: null,
        },
    });

    reply.send({ message: '2FA disabled successfully.' });
};

export default {
    generate2FASetup,
    enable2FA,
    disable2FA,
};
