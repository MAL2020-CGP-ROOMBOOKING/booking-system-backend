const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

// Ensure indexes for faster queries
async function setupIndexes() {
    const db = getDB();
    await db.collection("logs").createIndex({ userId: 1 });
    await db.collection("logs").createIndex({ action: 1 });
    await db.collection("logs").createIndex({ timestamp: -1 });
}

// Create Log Entry
exports.createLog = async (req, res) => {
    try {
        const { userId, action, actorType, details } = req.body;

        if (!userId || !action || !actorType) {
            return res.status(400).json({ error: "User ID, action, and actorType are required" });
        }

        const logEntry = {
            userId: new ObjectId(userId), // Convert to ObjectId for consistency
            action,
            actorType,
            details: details && typeof details === "object" ? details : {}, // Ensure it's an object
            timestamp: new Date() // Automatically generated timestamp
        };

        const result = await getDB().collection("logs").insertOne(logEntry);
        res.status(201).json({ message: "Log recorded", id: result.insertedId });
    } catch (err) {
        console.error("Failed to log action:", err);
        res.status(500).json({ error: "Failed to add log" });
    }
};

// Get All Logs (With Filters & Pagination)
exports.getAllLogs = async (req, res) => {
    try {
        const { page = 1, limit = 10, userId, action } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const query = {};

        if (userId && ObjectId.isValid(userId)) {
            query.userId = new ObjectId(userId);
        }
        if (action) {
            query.action = action;
        }

        const logs = await getDB()
            .collection("logs")
            .find(query)
            .sort({ timestamp: -1 }) // Newest logs first
            .skip(skip)
            .limit(parseInt(limit))
            .toArray();

        res.json(logs);
    } catch (err) {
        console.error("Failed to fetch logs:", err);
        res.status(500).json({ error: "Failed to fetch logs" });
    }
};

// Get Log by ID
exports.getLogById = async (req, res) => {
    try {
        const { logId } = req.params;

        if (!ObjectId.isValid(logId)) {
            return res.status(400).json({ error: "Invalid log ID format" });
        }

        const log = await getDB().collection("logs").findOne({ _id: new ObjectId(logId) });

        if (!log) return res.status(404).json({ error: "Log not found" });

        res.json(log);
    } catch (err) {
        console.error("Failed to fetch log:", err);
        res.status(500).json({ error: "Failed to fetch log" });
    }
};

// Run setup once when the API starts
setupIndexes().catch(console.error);
