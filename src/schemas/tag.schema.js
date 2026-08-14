const { z } = require('zod');

const tagSchema = z.object({
    name: z.string().min(1),
})

module.exports = { tagSchema };