const { getDB } = require("../config/db");
const bcryptor = require("../modules/bcryptor");
const { ObjectId } = require("mongodb");

exports.renderCreateAdmin = async (req, res) => {
    res.render('admin-create');
};

exports.renderLoginAdmin = async (req, res) => {
    res.render('admin-login');
};

exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await getDB().collection("admins").find().toArray();
        res.json(admins);
    } catch {
        res.status(500).json({ error: "Failed to fetch admins" });
    }
};

exports.getAdminById = async (req, res) => {
    try {
        const admin = await getDB().collection("admins").findOne({ _id: new ObjectId(req.params.adminId) });
        if (!admin) return res.status(404).json({ error: "Admin not found" });
        res.json(admin);
    } catch {
        res.status(500).json({ error: "Failed to fetch admin" });
    }
};

exports.postCreateAdmin = async (req, res) => {
    try {
        const { name, email, password, phoneNumber, company } = req.body;
        if (!name || !email || !password) return res.status(400).json({ error: "Name, email, and password are required" });

        const db = getDB();

        const existingAdmin = await db.collection("admins").findOne({ email });
        if (existingAdmin) return res.status(400).json({ error: "Email already registered" });

        // Hash password & insert data
        const result = await db.collection("admins").insertOne({
            name,
            email,
            password: await bcryptor.hashPassword(password),
            phoneNumber,
            company,
            role: "admin",
            createdAt: new Date(),
        });

        /*
        await db.collection("logs").insertOne({
            actorId: new ObjectId(req.user.id),
            actorType: "admin",
            action: "ADMIN_CREATED",
            details: { email, company, role: "admin" },
            timestamp: new Date(),
        });
        */

        res.status(201).json({ message: "Admin created", id: result.insertedId });
        res.render('admin-create');
    } catch (err) {
        res.status(500).json({ error: "Failed to create admin" });
    }
};

exports.postLoginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const db = getDB();

        const match = await db.collection("admins").findOne({ email });

        if(match) {
            console.log('Match found!');
            console.log('Email: ', match.email);
            console.log('Password: ', match.password);

            const passwordMatch = await bcryptor.verifyPassword(password, match.password);

            if(passwordMatch) {
                console.log('Password Correct!');
            } else {
                console.log('Password Incorrect!');
            }

            res.render('admin-login');
        } else {
            console.log('User not found...');
            res.render('admin-login');
        }
    } catch {

    }
};

exports.updateAdmin = async (req, res) => {
    try {
        const adminId = new ObjectId(req.user.id);
        const result = await getDB().collection("admins").updateOne({ _id: adminId }, { $set: req.body });

        if (!result.modifiedCount) return res.status(404).json({ error: "Admin not found or no changes made" });

        await getDB().collection("logs").insertOne({
            actorId: adminId,
            actorType: req.user.role,
            action: "ADMIN_UPDATED",
            details: req.body,
            timestamp: new Date(),
        });

        res.json({ message: "Admin updated" });
    } catch {
        res.status(500).json({ error: "Failed to update admin" });
    }
};

exports.deleteAdmin = async (req, res) => {
    try {
        const adminId = new ObjectId(req.user.id);
        const result = await getDB().collection("admins").deleteOne({ _id: adminId });

        if (!result.deletedCount) return res.status(404).json({ error: "Admin not found" });

        await getDB().collection("logs").insertOne({
            actorId: adminId,
            actorType: req.user.role,
            action: "ADMIN_DELETED",
            details: { adminId },
            timestamp: new Date(),
        });

        res.json({ message: "Admin deleted" });
    } catch {
        res.status(500).json({ error: "Failed to delete admin" });
    }
};
