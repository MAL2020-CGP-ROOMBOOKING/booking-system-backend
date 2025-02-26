const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

exports.renderCreateRoom = async (req, res) => {
    res.render('createRoom');
}

exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await getDB().collection("rooms").find().toArray();
        res.json(rooms);
    } catch (err) {
        console.error("Error fetching rooms:", err.message);
        res.status(500).json({ error: "Failed to fetch rooms", details: err.message });
    }
};

exports.getRoomById = async (req, res) => {
    try {
        const { roomId } = req.params;

        if (!ObjectId.isValid(roomId)) {
            console.warn("Invalid room ID format:", roomId);
            return res.status(400).json({ error: "Invalid room ID format" });
        }

        const room = await getDB().collection("rooms").findOne({ _id: new ObjectId(roomId) });
        if (!room) {
            console.warn("Room not found:", roomId);
            return res.status(404).json({ error: "Room not found" });
        }

        res.json(room);
    } catch (err) {
        console.error("Error fetching room:", err.message);
        res.status(500).json({ error: "Failed to fetch room", details: err.message });
    }
};

exports.postCreateRoom = async (req, res) => {
    try {
        /*
        if (!req.user?.id) {
            console.warn("Unauthorized access attempt to create a room.");
            return res.status(401).json({ error: "Unauthorized: User ID missing" });
        }
        */

        const { roomName, description, pax } = req.body;

        if (!roomName || !pax) {
            console.warn("Missing required fields:", { roomName, pax });
            return res.status(400).json({ error: "Room name and pax are required" });
        }

        const newRoom = { roomName, description, pax, createdAt: new Date() };

        const db = getDB();
        if (!db) {
            console.error("Database connection failed.");
            return res.status(500).json({ error: "Database connection failed" });
        }

        const result = await db.collection("rooms").insertOne(newRoom);
        if (!result.insertedId) {
            console.error("Room creation failed.");
            return res.status(500).json({ error: "Room creation failed" });
        }

        //res.status(201).json({ message: "Room created", id: result.insertedId });
        res.render('createRoom');

    } catch (err) {
        console.error("Error creating room:", err.message);
        
        //res.status(500).json({ error: "Failed to create room", details: err.message });
        res.render('createRoom');
    }
};

exports.updateRoom = async (req, res) => {
    try {
        const { roomId } = req.params;

        if (!ObjectId.isValid(roomId)) {
            console.warn("Invalid room ID:", roomId);
            return res.status(400).json({ error: "Invalid room ID" });
        }

        if (Object.keys(req.body).length === 0) {
            console.warn("No update data provided.");
            return res.status(400).json({ error: "Update data is required" });
        }

        const result = await getDB().collection("rooms").updateOne(
            { _id: new ObjectId(roomId) },
            { $set: req.body }
        );

        if (result.modifiedCount === 0) {
            console.warn("No changes made or room not found:", roomId);
            return res.status(404).json({ error: "Room not found or no changes made" });
        }

        res.json({ message: "Room updated" });
    } catch (err) {
        console.error("Error updating room:", err.message);
        res.status(500).json({ error: "Failed to update room", details: err.message });
    }
};

exports.deleteRoom = async (req, res) => {
    try {
        const { roomId } = req.params;

        if (!ObjectId.isValid(roomId)) {
            console.warn("Invalid room ID:", roomId);
            return res.status(400).json({ error: "Invalid room ID" });
        }

        const result = await getDB().collection("rooms").deleteOne({ _id: new ObjectId(roomId) });

        if (result.deletedCount === 0) {
            console.warn("Room not found:", roomId);
            return res.status(404).json({ error: "Room not found" });
        }

        res.json({ message: "Room deleted" });
    } catch (err) {
        console.error("Error deleting room:", err.message);
        res.status(500).json({ error: "Failed to delete room", details: err.message });
    }
};
