const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");
const bcryptor = require("../modules/bcryptor");

// test

exports.postCreateUser = async (req, res) => {
    try {
        const { name, email, password, phoneNumber, company } = req.body;
        // if (!name || !email || !password) return res.status(400).json({ error: "Name, email, and password are required" });
        // required tag in html forms could maybe detect this

        const db = getDB();

        // check for existing user
        const existingUser = await db.collection("users").findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already registered" });

        // password hashing takes place here
        const hashedPassword = await bcryptor.hashPassword(password);
        const newUser = { name, email, password: hashedPassword, phoneNumber, company, createdAt: new Date() };
        const result = await db.collection("users").insertOne(newUser);

        await db.collection("logs").insertOne({
            actorId: new ObjectId(req.user.id),
            actorType: req.user.role,
            action: "USER_CREATED",
            details: { name, email, company },
            timestamp: new Date(),
        });

        res.status(201).json({ message: "User created", id: result.insertedId });
    } catch {
        res.status(500).json({ error: "Failed to create user" });
    }
};

// end test

exports.getAllUsers = async (req, res) => {
    try {
        const users = await getDB().collection("users").find().toArray();
        res.json(users);
    } catch {
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!ObjectId.isValid(userId)) return res.status(400).json({ error: "Invalid ObjectId format" });

        const user = await getDB().collection("users").findOne({ _id: new ObjectId(userId) });
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user);
    } catch {
        res.status(500).json({ error: "Failed to fetch user" });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { name, email, password, phoneNumber, company } = req.body;
        if (!name || !email || !password) return res.status(400).json({ error: "Name, email, and password are required" });

        const db = getDB();
        const existingUser = await db.collection("users").findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already registered" });

        const hashedPassword = await bcryptor.hashPassword(password);
        const newUser = { name, email, password: hashedPassword, phoneNumber, company, createdAt: new Date() };
        const result = await db.collection("users").insertOne(newUser);

        await db.collection("logs").insertOne({
            actorId: new ObjectId(req.user.id),
            actorType: req.user.role,
            action: "USER_CREATED",
            details: { name, email, company },
            timestamp: new Date(),
        });

        res.status(201).json({ message: "User created", id: result.insertedId });
    } catch {
        res.status(500).json({ error: "Failed to create user" });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!ObjectId.isValid(userId)) return res.status(400).json({ error: "Invalid ObjectId format" });

        const updateData = { ...req.body };
        if (updateData.password) updateData.password = await bcryptor.hashPassword(updateData.password);

        const result = await getDB().collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: updateData });
        if (!result.modifiedCount) return res.status(404).json({ error: "User not found or no changes made" });

        await getDB().collection("logs").insertOne({
            actorId: new ObjectId(req.user.id),
            actorType: req.user.role,
            action: "USER_UPDATED",
            details: updateData,
            timestamp: new Date(),
        });

        res.json({ message: "User updated" });
    } catch {
        res.status(500).json({ error: "Failed to update user" });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!ObjectId.isValid(userId)) return res.status(400).json({ error: "Invalid ObjectId format" });

        const result = await getDB().collection("users").deleteOne({ _id: new ObjectId(userId) });
        if (!result.deletedCount) return res.status(404).json({ error: "User not found" });

        await getDB().collection("logs").insertOne({
            actorId: new ObjectId(req.user.id),
            actorType: req.user.role,
            action: "USER_DELETED",
            details: { userId },
            timestamp: new Date(),
        });

        res.json({ message: "User deleted" });
    } catch {
        res.status(500).json({ error: "Failed to delete user" });
    }
};
