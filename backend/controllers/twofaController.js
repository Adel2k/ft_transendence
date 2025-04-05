import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import prisma from '../db/prisma.js';

const generate2FA = async (req, reply) => {
    const user = req.user;

    const secret = speakeasy.generateSecret({
        name: `ft_transcendence (${user.username})`,
    });

    await prisma.user.update({
        where: { id: user.id },
        data: {
            twofaSecret: secret.base32,
            is2faEnabled: false,
        },
    });

    const qrData = await qrcode.toDataURL(secret.otpauth_url);

    reply.send({
        message: 'Scan the QR with Google Authenticator',
        qr: qrData,
        base32: secret.base32,
    });
};

const verify2FA = async (req, reply) => {
    const { token } = req.body;
    const userId = req.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.twofaSecret)
        return reply.status(400).send({ error: '2FA setup not found.' });

    const verified = speakeasy.totp.verify({
        secret: user.twofaSecret,
        encoding: 'base32',
        token,
    });

    if (!verified) {
        return reply.status(401).send({ error: 'Invalid 2FA token.' });
    }

    await prisma.user.update({
        where: { id: userId },
        data: {
            is2faEnabled: true,
        },
    });

    reply.send({ message: '2FA has been enabled.' });
};

const toggle2FA = async (req, reply) => {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (!user)
        return reply.status(404).send({ error: 'User not found.' });

    if (!user.is2faEnabled) {
        const secret = speakeasy.generateSecret({
            name: `ft_transcendence (${user.username})`,
        });

        await prisma.user.update({
            where: { id: user.id },
            data: {
                twofaSecret: secret.base32,
                is2faEnabled: false,
            },
        });

        const qrData = await qrcode.toDataURL(secret.otpauth_url);

        return reply.send({
            message: '2FA setup started. Scan this QR.',
            qr: qrData,
            base32: secret.base32,
        });
    }

    const { code } = req.body;

    if (!code)
        return reply.status(400).send({ error: '2FA code is required to disable.' });

    const valid = speakeasy.totp.verify({
        secret: user.twofaSecret,
        encoding: 'base32',
        token: code,
    });

    if (!valid)
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
    generate2FA,
    verify2FA,
    toggle2FA
};
