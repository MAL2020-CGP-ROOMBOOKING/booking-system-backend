const { getDB } = require("../db");
const bcryptor = require("../modules/bcryptor");
const { ObjectId } = require("mongodb");

exports.renderDashboard = async (req, res) => {
    res.render('admin/dashboard', {currentPage: 'dashboard', user : req.session.user});
};

exports.renderManageReservation = async (req, res) => {
    res.render('admin/manage-reservation', {currentPage: 'bookings', user: req.session.user});
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
        if (existingAdmin) return res.status(400).json({ error: "Email already exists." });

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

        // Log
        await db.collection("logs").insertOne({
            actorId: result.insertedId,
            actorType: "admin",
            action: "ADMIN_CREATED",
            details: { name, email, company, role: "admin" },
            timestamp: new Date(),
        });
        
        res.status(201).json({ message: "Admin created", id: result.insertedId });
        res.render('admin-create');

    } catch (err) {
        res.status(500).json({ error: "Failed to create admin" });
    }
};