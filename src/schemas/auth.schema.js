const { z } = require('zod');

const signupSchema = z.object({
    email: z.string().email(),
    password: z.syring.min(6),
});

const loginSchema = z.object({
    email: z.string.email(),
    password: z.string.min(1),
});

module.export = { signupSchema, loginSchema };