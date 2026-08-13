const bcrypt = require('bcryptjs');
const prisma = require('../config/db')
const { signToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');

async function signup(req, res, next) {
    try {
        const { email, password } = req.body;
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) throw new AppError("Email already in use", 409);

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, passwordHash },
            select: { id: true, email: true, createdAt: true }
        });

        const token = signToken(user.id);
        res.status(201).json({ user, token });
    } catch (err) {
        next(err);
    }
};


async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const existing = await prisma.user.findUnique({ where: { email } });
        if (!existing) throw new AppError("Invalid Credentials");

        const match = await bcrypt.compare(password, existing.passwordHash);
        if (!match) throw new AppError("Invalid Credentials", 401);

        const token = signToken(existing.id);
        res.json({ user: { id: existing.id, email: existing.email }, token });
    } catch (err) {
        next(err);
    }

}
module.exports = { signup, login };