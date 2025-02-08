const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

/**
 * Retrieve all users from the database.
 */
exports.getAllUsers = async (req, res) => {
    try {
        const users = await getDB().collection("users").find().toArray();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

/**
 * Retrieve a specific user by ID.
 */
exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid ObjectId format" });
        }

        const user = await getDB().collection("users").findOne({ _id: new ObjectId(userId) });

        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch user" });
    }
};

/**
 * Create a new user with the provided details.
 */
exports.createUser = async (req, res) => {
    try {
        const { name, password, email, phoneNumber, company } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "Name, email, and password are required" });
        }

        const newUser = { name, password, email, phoneNumber, company };

        const result = await getDB().collection("users").insertOne(newUser);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: "Failed to create user" });
    }
};

/**
 * Update an existing user by ID.
 */
exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid ObjectId format" });
        }

        const updateData = req.body;
        const result = await getDB().collection("users").updateOne(
            { _id: new ObjectId(userId) },
            { $set: updateData }
        );

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "Failed to update user" });
    }
};

/**
 * Delete a user by ID.
 */
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid ObjectId format" });
        }

        const result = await getDB().collection("users").deleteOne({ _id: new ObjectId(userId) });

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "Failed to delete user" });
    }
};
