const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await getDB().collection("rooms").find().toArray();
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch rooms" });
    }
};

exports.getRoomById = async (req, res) => {
    try {
        const room = await getDB().collection("rooms").findOne({ _id: new ObjectId(req.params.roomId) });
        if (!room) return res.status(404).json({ error: "Room not found" });
        res.json(room);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch room" });
    }
};

exports.createRoom = async (req, res) => {
    try {
        const { roomName, description, pax } = req.body;
        if (!roomName || !pax) return res.status(400).json({ error: "Room name and pax are required" });

        const result = await getDB().collection("rooms").insertOne({ roomName, description, pax });
        res.status(201).json({ message: "Room created", id: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: "Failed to add room" });
    }
};

exports.updateRoom = async (req, res) => {
    try {
        const result = await getDB().collection("rooms").updateOne(
            { _id: new ObjectId(req.params.roomId) },
            { $set: req.body }
        );
        if (!result.modifiedCount) return res.status(404).json({ error: "Room not found or no changes made" });
        res.json({ message: "Room updated" });
    } catch (err) {
        res.status(500).json({ error: "Failed to update room" });
    }
};

exports.deleteRoom = async (req, res) => {
    try {
        const result = await getDB().collection("rooms").deleteOne({ _id: new ObjectId(req.params.roomId) });
        if (!result.deletedCount) return res.status(404).json({ error: "Room not found" });
        res.json({ message: "Room deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete room" });
    }
};
