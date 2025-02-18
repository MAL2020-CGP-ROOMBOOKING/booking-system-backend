const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

// Fetch all reservations
exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await getDB().collection("reservations").find().toArray();
        res.json(reservations);
    } catch (err) {
        console.error("Error fetching reservations:", err);
        res.status(500).json({ error: "Failed to fetch reservations", details: err.message });
    }
};

// Fetch a single reservation by ID
exports.getReservationById = async (req, res) => {
    try {
        const { reservationId } = req.params;

        if (!ObjectId.isValid(reservationId)) {
            return res.status(400).json({ error: "Invalid reservation ID format" });
        }

        const reservation = await getDB().collection("reservations").findOne({ _id: new ObjectId(reservationId) });
        if (!reservation) return res.status(404).json({ error: "Reservation not found" });

        res.json(reservation);
    } catch (err) {
        console.error("Error fetching reservation by ID:", err);
        res.status(500).json({ error: "Failed to fetch reservation", details: err.message });
    }
};

// Create a new reservation
exports.createReservation = async (req, res) => {
    try {
        const { userId, roomId, reserveDate, reserveTime, status, adminId } = req.body;

        // Validate required fields
        if (!userId || !roomId || !reserveDate || !reserveTime) {
            return res.status(400).json({ error: "User ID, Room ID, Date, and Time are required" });
        }

        // Validate ObjectId format
        if (!ObjectId.isValid(userId) || !ObjectId.isValid(roomId)) {
            return res.status(400).json({ error: "Invalid User ID or Room ID format" });
        }

        const newReservation = {
            userId: new ObjectId(userId),
            roomId: new ObjectId(roomId),
            date: new Date(reserveDate), // Ensure proper date formatting
            time: reserveTime.trim(),
            status: status || "pending",
            adminId: adminId ? new ObjectId(adminId) : null,
            createdAt: new Date(),
        };

        const result = await getDB().collection("reservations").insertOne(newReservation);
        if (!result.insertedId) {
            return res.status(500).json({ error: "Failed to create reservation" });
        }

        // Log reservation creation
        const logEntry = {
            actorId: new ObjectId(userId),
            actorType: "USER",
            action: "RESERVATION_CREATED",
            details: { reservationId: result.insertedId, roomId, date: reserveDate, time: reserveTime },
            timestamp: new Date(),
        };
        await getDB().collection("logs").insertOne(logEntry);

        res.status(201).json({ message: "Reservation created", id: result.insertedId });
    } catch (err) {
        console.error("Error creating reservation:", err);
        res.status(500).json({ error: "Failed to add reservation", details: err.message });
    }
};

// Update a reservation
exports.updateReservation = async (req, res) => {
    try {
        const { reservationId } = req.params;
        if (!ObjectId.isValid(reservationId)) {
            return res.status(400).json({ error: "Invalid reservation ID format" });
        }

        const updateFields = {};
        if (req.body.reserveDate) updateFields.date = new Date(req.body.reserveDate);
        if (req.body.reserveTime) updateFields.time = req.body.reserveTime.trim();
        if (req.body.status) updateFields.status = req.body.status;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ error: "At least one field is required to update" });
        }

        const result = await getDB().collection("reservations").updateOne(
            { _id: new ObjectId(reservationId) },
            { $set: updateFields }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Reservation not found" });
        }

        // Log reservation update
        const logEntry = {
            actorId: req.user?.id ? new ObjectId(req.user.id) : "system",
            actorType: req.user?.role || "system",
            action: "RESERVATION_UPDATED",
            details: { reservationId, updatedFields: updateFields },
            timestamp: new Date(),
        };
        await getDB().collection("logs").insertOne(logEntry);

        res.json({ message: "Reservation updated successfully" });
    } catch (err) {
        console.error("Error updating reservation:", err);
        res.status(500).json({ error: "Failed to update reservation", details: err.message });
    }
};

// Delete a reservation
exports.deleteReservation = async (req, res) => {
    try {
        const { reservationId } = req.params;
        if (!ObjectId.isValid(reservationId)) {
            return res.status(400).json({ error: "Invalid reservation ID format" });
        }

        const result = await getDB().collection("reservations").deleteOne({ _id: new ObjectId(reservationId) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Reservation not found" });
        }

        // Log reservation deletion
        const logEntry = {
            actorId: req.user?.id ? new ObjectId(req.user.id) : "system",
            actorType: req.user?.role || "system",
            action: "RESERVATION_DELETED",
            details: { reservationId },
            timestamp: new Date(),
        };
        await getDB().collection("logs").insertOne(logEntry);

        res.json({ message: "Reservation deleted successfully" });
    } catch (err) {
        console.error("Error deleting reservation:", err);
        res.status(500).json({ error: "Failed to delete reservation", details: err.message });
    }
};
