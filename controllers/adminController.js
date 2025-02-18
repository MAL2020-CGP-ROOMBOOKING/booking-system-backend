const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");
const bcrypt = require("bcrypt");

exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await getDB().collection("admins").find().toArray();
        res.json(admins);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch admins" });
    }
};

exports.getAdminById = async (req, res) => {
    try {
        const admin = await getDB().collection("admins").findOne({ _id: new ObjectId(req.params.adminId) });
        if (!admin) return res.status(404).json({ error: "Admin not found" });
        res.json(admin);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch admin" });
    }
};

exports.createAdmin = async (req, res) => {
    try {
        const { name, email, password, phoneNumber, company } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "Name, email, and password are required" });
        }

        const db = getDB();

        // Extract actor information from token (who performed this action)
        const actorId = req.user.id; // Extracted from JWT token middleware
        const actorType = req.user.role; // Extracted from JWT token middleware

        // Check if email already exists
        const existingAdmin = await db.collection("admins").findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ error: "Email already registered" });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = {
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            company,
            role: "admin", // Assign the role automatically
            createdAt: new Date(),
        };

        const result = await db.collection("admins").insertOne(newAdmin);

        // Log the action
        const logEntry = {
            actorId: new ObjectId(actorId), // Who performed the action
            actorType, // Role of the user performing the action
            action: "ADMIN_CREATED",
            details: { email, company, role: "admin" }, // Capture key details
            timestamp: new Date(),
        };

        await db.collection("logs").insertOne(logEntry);

        res.status(201).json({ message: "Admin created", id: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: "Failed to create admin", details: err.message });
    }
};




exports.updateAdmin = async (req, res) => {
    try {
        const db = getDB();
        const adminId = new ObjectId(req.user.id); // Convert token ID to ObjectId

        const result = await db.collection("admins").updateOne(
            { _id: adminId }, // Use converted ObjectId
            { $set: req.body }
        );

        if (!result.modifiedCount) {
            return res.status(404).json({ error: "Admin not found or no changes made" });
        }

        // Log the update action
        await db.collection("logs").insertOne({
            actorId: adminId,
            actorType: req.user.role,
            action: "ADMIN_UPDATED",
            details: req.body,
            timestamp: new Date(),
        });

        res.json({ message: "Admin updated" });
    } catch (err) {
        console.error("Update Admin Error:", err);
        res.status(500).json({ error: "Failed to update admin" });
    }
};

exports.deleteAdmin = async (req, res) => {
    try {
        const db = getDB();
        const adminId = new ObjectId(req.user.id); // Convert token ID to ObjectId

        const result = await db.collection("admins").deleteOne({ _id: adminId });

        if (!result.deletedCount) {
            return res.status(404).json({ error: "Admin not found" });
        }

        // Log the deletion action
        await db.collection("logs").insertOne({
            actorId: adminId,
            actorType: req.user.role,
            action: "ADMIN_DELETED",
            details: { adminId },
            timestamp: new Date(),
        });

        res.json({ message: "Admin deleted" });
    } catch (err) {
        console.error("Delete Admin Error:", err);
        res.status(500).json({ error: "Failed to delete admin" });
    }
};
