const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await getDB().collection("users").find().toArray();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await getDB().collection("users").findOne({ _id: new ObjectId(req.params.id) });
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch user" });
    }
};

// Add new user
exports.createUser = async (req, res) => {
    try {
        const { name, email, phoneNumber, company } = req.body;
        if (!name || !email) return res.status(400).json({ error: "Name and Email are required" });

        const result = await getDB().collection("users").insertOne({ name, email, phoneNumber, company });
        res.status(201).json({ message: "User created", id: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: "Failed to add user" });
    }
};

// Update user by ID
exports.updateUser = async (req, res) => {
    try {
        const result = await getDB().collection("users").updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body }
        );
        if (!result.modifiedCount) return res.status(404).json({ error: "User not found or no changes made" });
        res.json({ message: "User updated" });
    } catch (err) {
        res.status(500).json({ error: "Failed to update user" });
    }
};

// Delete user by ID
exports.deleteUser = async (req, res) => {
    try {
        const result = await getDB().collection("users").deleteOne({ _id: new ObjectId(req.params.id) });
        if (!result.deletedCount) return res.status(404).json({ error: "User not found" });
        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete user" });
    }
};
