const { verifyToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');

function authGuard(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) return next(new AppError("No Token provided"), 401);

    const token = header.split(' ')[1];
    try {
        const payload = verifyToken(token);
        req.user = { id: payload.userId }
        next()
    } catch (err) next(new AppError('Invalid Token', 401));
}

module.exports = authGuard;