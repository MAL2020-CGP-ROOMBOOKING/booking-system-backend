const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

exports.createLog = async (req, res) => {
    try {
        const { userId, action, actorType, details } = req.body;
        if (!userId || !action || !actorType) {
            return res.status(400).json({ error: "User ID, action, and actorType are required" });
        }

        const logEntry = {
            userId,
            action,
            actorType,
            details: details || {},
            timestamp: new Date()
        };

        const result = await getDB().collection("logs").insertOne(logEntry);
        res.status(201).json({ message: "Log recorded", id: result.insertedId });
    } catch (err) {
        console.error("Failed to log action:", err);
        res.status(500).json({ error: "Failed to add log" });
    }
};

exports.getAllLogs = async (req, res) => {
    try {
        const logs = await getDB().collection("logs").find().toArray();
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch logs" });
    }
};

exports.getLogById = async (req, res) => {
    try {
        const log = await getDB().collection("logs").findOne({ _id: new ObjectId(req.params.logId) });
        if (!log) return res.status(404).json({ error: "Log not found" });

        res.json(log);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch log" });
    }
};
