const express = require("express");
const { getAllReservations, getReservationsByRoomId, createReservation, deleteReservation, renderCreateReservation } = require("../controllers/reservationController.js");

const router = express.Router();

router.get('/create', renderCreateReservation);
router.post('/create', createReservation)

// in progress
router.get('/:roomId', getReservationsByRoomId);

/*
router.get("/", getAllReservations);
router.get("/:reservationId", getReservationById);
router.post("/", createReservation);
router.put("/:reservationId", updateReservation);
router.delete("/:reservationId", deleteReservation);
*/

module.exports = router;
