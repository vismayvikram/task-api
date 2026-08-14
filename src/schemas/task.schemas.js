const { z } = require('zod');
const statusEnum = z.enum(['todo', 'in_progress', 'done']);

const createSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    status: statusEnum.optional(),
    dueDate: z.string().datetime().optional(),
});

const updateSchema = createSchema.partial();

module.exports = { createSchema, updateSchema }