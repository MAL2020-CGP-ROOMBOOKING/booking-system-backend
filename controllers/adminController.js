const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

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
        const { name, password, email, phoneNumber, company } = req.body;
        if (!name || !email || !password) return res.status(400).json({ error: "Name, Email, and Password are required" });

        const result = await getDB().collection("admins").insertOne({ name, password, email, phoneNumber, company });
        res.status(201).json({ message: "Admin created", id: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: "Failed to add admin" });
    }
};

exports.updateAdmin = async (req, res) => {
    try {
        const result = await getDB().collection("admins").updateOne(
            { _id: new ObjectId(req.params.adminId) },
            { $set: req.body }
        );
        if (!result.modifiedCount) return res.status(404).json({ error: "Admin not found or no changes made" });
        res.json({ message: "Admin updated" });
    } catch (err) {
        res.status(500).json({ error: "Failed to update admin" });
    }
};

exports.deleteAdmin = async (req, res) => {
    try {
        const result = await getDB().collection("admins").deleteOne({ _id: new ObjectId(req.params.adminId) });
        if (!result.deletedCount) return res.status(404).json({ error: "Admin not found" });
        res.json({ message: "Admin deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete admin" });
    }
};
