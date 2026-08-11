const jwt = require('jsonwebtoken');

function signToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET)
}

module.exports = { signToken, verifyToken };
