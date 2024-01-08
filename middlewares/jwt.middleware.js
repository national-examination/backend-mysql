const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized - Token not provided" });
        }
        token = token.split(' ')[1];
        await jwt.verify(token, process.env.SECRET);

        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ error: "Unauthorized - Invalid token" });
    }
};

module.exports = authenticateToken;