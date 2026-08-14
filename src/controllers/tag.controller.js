const prisma = require("../config/db");
const AppError = require("../utils/AppError");

async function checkOwner(taskId, userId) {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new AppError("Task Not Found", 404);
    if (task.userId != userId) throw new AppError("Forbidden", 403);
}

async function addTag(req, res, next) {
    try {
        const taskId = Number(req.params.id);
        await checkOwner(taskId, req.user.id);

        const { name } = req.body;
        const tag = await prisma.tag.upsert({ where: { name }, update: { name }, create: { name } });

        await prisma.taskTag.upsert({
            where: { taskId_tagId: { taskId, tagId: tag.id } },
            update: {},
            create: { taskId, tagId: tag.id },
        });

        res.status(201).json(tag);
    } catch (err) { next(err); }
}

async function removeTag(req, res, next) {
    try {
        const taskId = Number(req.params.id);
        const tagId = Number(req.params.tagId);
        await checkOwner(taskId, req.user.id);

        await prisma.taskTag.delete({ where: { taskId_tagId: { taskId, tagId } } });
        res.status(204).send();
    } catch (err) { next(err); }
}


module.exports = { addTag, removeTag }