const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {


    // Check if token is present
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ error: "Access denied, token missing" });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
};
