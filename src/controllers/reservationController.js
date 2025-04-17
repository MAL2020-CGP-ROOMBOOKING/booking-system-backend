const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

exports.renderCreateReservation = async (req, res) => {
    res.render('user/create-reservation', {currentPage: 'bookings'});
};

exports.getReservationsByRoomId = async (req, res) => {
    const roomId = req.query.roomId;
    const dates = req.query.dates;

    const startOfWeek = new Date(dates[0]);
    const endOfWeek = new Date(dates[dates.length - 1]);

    const reservations = await getDB()
        .collection("reservations")
        .find({ 
            roomId: roomId,
            date: {
                $gte: new Date(startOfWeek),
                $lte: new Date(endOfWeek)
            }
        })
        .toArray();

    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const reservationDetails = [];

    reservations.forEach(reservation => {
        const startTime = reservation.startTime.toISOString().split("T")[1].slice(0, 5);
        const endTime = reservation.endTime.toISOString().split("T")[1].slice(0, 5);

        const day = dayNames[reservation.date.getDay()];
        const date = reservation.date.toISOString().split("T")[0];

        reservationDetails.push({day, date, startTime, endTime});
    });
    
    res.json(reservationDetails) 
};

exports.getReservationsByDate = async (req, res) => {
    const dates = req.query.dates;

    
};

exports.createReservation = async (req, res) => {
    try {
        const { roomId, date, startTime, endTime } = req.body;

        if (!date || !startTime || !endTime) {
            return res.status(400).json({ error: "User ID, Room ID, Date, and Time are required" });
        }

        /*
        if (!ObjectId.isValid(userId) || !ObjectId.isValid(roomId)) {
            return res.status(400).json({ error: "Invalid User ID or Room ID format" });
        }
        */

        const input_date = new Date(date);

        let input_startTime = new Date(`${date}T${startTime}`);
        input_startTime.setHours(input_startTime.getHours() + 8);

        let input_endTime = new Date(`${date}T${endTime}`);
        input_endTime.setHours(input_endTime.getHours() + 8);

        const newReservation = {
            userId: req.session.user._id,
            roomId,
            date: input_date,
            startTime: input_startTime,
            endTime: input_endTime,
            status: "Pending",
            adminId: null,
            createdAt: new Date(),
        };

        const result = await getDB().collection("reservations").insertOne(newReservation);

        if (!result.insertedId) {
            return res.status(500).json({ error: "Failed to create reservation" });
        }

        const logEntry = {
            actorId: req.session.user._id,
            actorType: req.session.user.role,
            action: "RESERVATION_CREATED",
            details: {
                reservationId: result.insertedId,
                roomId: result.roomId,
                date,
                startTime,
                endTime, },
            timestamp: new Date(),
        };
        await getDB().collection("logs").insertOne(logEntry);

        res.redirect('/users/dashboard');

    } catch (err) {
        console.error("Error creating reservation:", err);
        res.status(500).json({ error: "Failed to add reservation", details: err.message });
    }
};

exports.getReservationByRoomAndWeek = async (req, res) => {
    try {
        const { room, week } = req.body;

        db = getDB();
        match = db.collection('reservations')
        console.log(room, week);
    } catch {

    }
};

exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await getDB().collection("reservations").find().toArray();
        res.json(reservations);
    } catch (err) {
        console.error("Error fetching reservations:", err);
        res.status(500).json({ error: "Failed to fetch reservations", details: err.message });
    }
};

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

exports.getReservationCount = async (req, res) => {
    try {
        const reservationCount = await getDB().collection("reservations").countDocuments({});
        res.json({count: reservationCount});
    } catch (err) {
        console.error("Error fetching reservations:", err.message);
        res.status(500).json({ error: "Failed to fetch reservations", details: err.message });
    }
};