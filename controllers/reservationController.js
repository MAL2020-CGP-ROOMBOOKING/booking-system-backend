const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await getDB().collection("reservations").find().toArray();
        res.json(reservations);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch reservations" });
    }
};

exports.getReservationById = async (req, res) => {
    try {
        const reservation = await getDB().collection("reservations").findOne({ _id: new ObjectId(req.params.reservationId) });
        if (!reservation) return res.status(404).json({ error: "Reservation not found" });
        res.json(reservation);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch reservation" });
    }
};

exports.createReservation = async (req, res) => {
    try {
        const { userId, roomId, reserveDate, reserveTime, status, adminId } = req.body;
        if (!userId || !roomId || !reserveDate || !reserveTime) return res.status(400).json({ error: "User ID, Room ID, Date, and Time are required" });

        const result = await getDB().collection("reservations").insertOne({
            userId,
            roomId,
            date: reserveDate, // Fix naming mismatch
            time: reserveTime, // Fix naming mismatch
            status: status || "pending",
            adminId: adminId || null, // Optional adminId
            createdAt: new Date()
        });

        res.status(201).json({ message: "Reservation created", id: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: "Failed to add reservation" });
    }
};


exports.updateReservation = async (req, res) => {
    try {
        const result = await getDB().collection("reservations").updateOne(
            { _id: new ObjectId(req.params.reservationId) },
            { $set: req.body }
        );
        if (!result.modifiedCount) return res.status(404).json({ error: "Reservation not found or no changes made" });
        res.json({ message: "Reservation updated" });
    } catch (err) {
        res.status(500).json({ error: "Failed to update reservation" });
    }
};

exports.deleteReservation = async (req, res) => {
    try {
        const result = await getDB().collection("reservations").deleteOne({ _id: new ObjectId(req.params.reservationId) });
        if (!result.deletedCount) return res.status(404).json({ error: "Reservation not found" });
        res.json({ message: "Reservation deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete reservation" });
    }
};
