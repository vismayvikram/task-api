function validate(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                error: 'ValidationError',
                details: result.error.flatten().fieldError,
            });
        }
        req.body = result.data;
        next();
    }
}
module.export = validate;