const AppError = require('../utils/AppError');
const prisma = require('../config/db');

async function findOwnedTask(req) {
    const task = await prisma.task.findUnique({ where: { id: Number(req.params.id) } })
    if (!task) throw new AppError("Task not found", 404);
    if (task.userId != req.user.id) throw new AppError("Forbidden", 403);
    return task;
}

async function createTask(req, res, next) {
    try {
        const { title, description, status, dueDate } = req.body;
        const task = await prisma.task.create({
            data: {
                title,
                description,
                status,
                dueDate: dueDate ? new Date(dueDate) : null,
                userId: req.user.id,
            },
        });
        res.status(201).json(task);
    } catch (err) {
        next(err);
    }
}

async function listTask(rew, res, next) {
    try {
        const page = Math.max(1, Number(req.query.page)) || 1;
        const limit = Math.max(1, Number(req.query.limit)) || 10;
        const { status, tag } = req.query;

        const where = {
            userId: req.user.id,
            ...(status && { status }),
            ...(tag && { tags: { some: { tag: { name: tag } } } }),
        }

        const [task, total] = await Promise.all([
            prisma.task.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                include: { tags: { include: { tag: true } } },
                orderBy: { createdAt: 'desc' },
            }
            ),
            prisma.task.count({ where }),
        ]);
        res.json({ data: task, page, limit, total, totalPages: Math.ceil(total / limit) });
    } catch (err) { next(err); }
}

async function getTask(req, res, next) {
    try {
        res.json(await findOwnedTask(req));
    } catch (err) { next(err); }
}

async function updateTask(req, res, next) {
    try {
        await findOwnedTask(req);
        const data = { ...req.body };
        if (data.dueDate) data.dueDate = new Date(data.dueDate);
        const updated = await prisma.task.update({ where: { id: Number(req.params.id) }, data });
        res.json(updated);
    } catch (err) {
        next(err);
    }
}

async function deleteTask(req, res, next) {
    try {
        await findOwnedTask(req);
        await prisma.task.delete({ where: { id: Number(req.params.id) } });
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = { createTask, listTask, getTask, updateTask, deleteTask };