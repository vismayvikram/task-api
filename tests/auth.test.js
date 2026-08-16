const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/config/db');

beforeEach(async () => {
    await prisma.taskTag.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
});

afterAll(async () => {
    await prisma.$disconnect();
});

describe('Auth', () => {
    const user = { email: 'test@example.com', password: 'password123' };

    test('signup creates a user', async () => {
        const res = await request(app).post('/api/auth/signup').send(user);

        expect(res.status).toBe(201);
        expect(res.body.token).toBeDefined();
    });

    test('login succeeds with correct credentials', async () => {
        await request(app).post('/api/auth/signup').send(user);
        const res = await request(app).post('/api/auth/login').send(user);

        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
    });

    test('login fails with wrong password', async () => {
        await request(app).post('/api/auth/signup').send(user);
        const res = await request(app).post('/api/auth/login').send({ email: user.email, password: 'wrongpass' });

        expect(res.status).toBe(401);
    });
});