const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.path}`);


    // Check if token is present
    const token = req.header("Authorization");
    console.log("Received token:", token);

    if (!token) {
        console.log("Access denied, token missing.");
        return res.status(401).json({ error: "Access denied, token missing" });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        console.log("Token decoded successfully:", decoded);
        req.user = decoded;
        next();
    } catch (err) {
        console.log("Invalid token:", err.message);
        res.status(401).json({ error: "Invalid token" });
    }
};
