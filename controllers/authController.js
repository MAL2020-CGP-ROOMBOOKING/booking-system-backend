const jwt = require("jsonwebtoken");
const { getDB } = require("../config/db");
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const db = getDB();

        // Find user in either admins or users collection
        const user = await db.collection("admins").findOne({ email }) || await db.collection("users").findOne({ email });

        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        console.log("User found:", user); // Debugging

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const tokenPayload = {
            id: user._id.toString(), // Convert ObjectId to string
            email: user.email,
            name: user.name,
            phoneNumber: user.phoneNumber,
            company: user.company,
            role: user.role || "user" // Default to "user" if undefined
        };

        console.log("Token Payload:", tokenPayload); // Debugging

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.json({ message: "Login successful", token });
    } catch (err) {
        console.error("Login Error:", err); // Debugging
        res.status(500).json({ error: "Login failed", details: err.message });
    }
};
