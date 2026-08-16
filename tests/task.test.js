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

async function createUserAndToken(email) {
    const res = await request(app).post('/api/auth/signup').send({ email, password: 'password123' });
    return res.body.token;
}

describe('Task CRUD + ownership', () => {
    test('user can create and fetch own task', async () => {
        const token = await createUserAndToken('a@example.com');
        const create = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'Test task' });

        expect(create.status).toBe(201);

        const get = await request(app).get(`/api/tasks/${create.body.id}`).set('Authorization', `Bearer ${token}`);

        expect(get.status).toBe(200);
        expect(get.body.title).toBe('Test task');
    });

    test("user cannot access another user's task", async () => {
        const tokenA = await createUserAndToken('a@example.com');
        const tokenB = await createUserAndToken('b@example.com');
        const create = await request(app).post('/api/tasks').set('Authorization', `Bearer ${tokenA}`).send({ title: 'Private task' });
        const res = await request(app).get(`/api/tasks/${create.body.id}`).set('Authorization', `Bearer ${tokenB}`);

        expect(res.status).toBe(403);
    });

    test('unauthenticated request is rejected', async () => {
        const res = await request(app).get('/api/tasks');

        expect(res.status).toBe(401);
    });
});