const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");
const { createLog } = require("./logController");

exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await getDB().collection("rooms").find().toArray();
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch rooms", details: err.message });
    }
};

exports.getRoomById = async (req, res) => {
    try {
        const { roomId } = req.params;
        if (!ObjectId.isValid(roomId)) {
            return res.status(400).json({ error: "Invalid room ID format" });
        }

        const room = await getDB().collection("rooms").findOne({ _id: new ObjectId(roomId) });
        if (!room) return res.status(404).json({ error: "Room not found" });

        res.json(room);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch room", details: err.message });
    }
};


exports.createRoom = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ error: "Unauthorized: User ID missing" });
        }

        const actorId = req.user.id; // Extracted from JWT
        const actorType = req.user.role; // Extracted from JWT

        const { roomName, description, pax } = req.body;
        if (!roomName || !pax) {
            return res.status(400).json({ error: "Room name and pax are required" });
        }

        const newRoom = { roomName, description, pax, createdAt: new Date() };
        const db = getDB();
        if (!db) return res.status(500).json({ error: "Database connection failed" });

        const result = await db.collection("rooms").insertOne(newRoom);
        if (!result.insertedId) return res.status(500).json({ error: "Room creation failed" });

        // Log entry
        const logEntry = {
            actorId: new ObjectId(actorId),
            actorType,
            action: "ROOM_CREATED",
            details: { roomId: result.insertedId, roomName, pax },
            timestamp: new Date()
        };

        await db.collection("logs").insertOne(logEntry);

        res.status(201).json({ message: "Room created", id: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: "Failed to create room", details: err.message });
    }
};

exports.updateRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        if (!ObjectId.isValid(roomId)) return res.status(400).json({ error: "Invalid room ID" });
        if (Object.keys(req.body).length === 0) return res.status(400).json({ error: "Update data is required" });

        const actorId = req.user?.id || "system";
        const actorType = req.user?.role || "system";

        const result = await getDB().collection("rooms").updateOne(
            { _id: new ObjectId(roomId) },
            { $set: req.body }
        );

        if (result.modifiedCount === 0) return res.status(404).json({ error: "Room not found or no changes made" });

        // Log entry
        const logEntry = {
            actorId: new ObjectId(actorId),
            actorType,
            action: "ROOM_UPDATED",
            details: { roomId, updatedFields: req.body },
            timestamp: new Date()
        };

        await getDB().collection("logs").insertOne(logEntry);

        res.json({ message: "Room updated" });
    } catch (err) {
        res.status(500).json({ error: "Failed to update room", details: err.message });
    }
};

exports.deleteRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        if (!ObjectId.isValid(roomId)) return res.status(400).json({ error: "Invalid room ID" });

        const actorId = req.user?.id || "system";
        const actorType = req.user?.role || "system";

        const result = await getDB().collection("rooms").deleteOne({ _id: new ObjectId(roomId) });
        if (result.deletedCount === 0) return res.status(404).json({ error: "Room not found" });

        // Log entry
        const logEntry = {
            actorId: new ObjectId(actorId),
            actorType,
            action: "ROOM_DELETED",
            details: { roomId },
            timestamp: new Date()
        };

        await getDB().collection("logs").insertOne(logEntry);

        res.json({ message: "Room deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete room", details: err.message });
    }
};
