const express = require("express");
const { getAllReservations, getReservationById, createReservation, deleteReservation, renderCreateReservation } = require("../controllers/reservationController.js");

const router = express.Router();

router.get('/create', renderCreateReservation);
router.post('/create', createReservation)

// in progress
router.get('/reservations', (req, res) => {
    const { room, week } = req.query;
    const reservations = 0;
    res.json(reservations);
});

/*
router.get("/", getAllReservations);
router.get("/:reservationId", getReservationById);
router.post("/", createReservation);
router.put("/:reservationId", updateReservation);
router.delete("/:reservationId", deleteReservation);
*/

module.exports = router;
