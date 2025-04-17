const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservationController.js");

router.get('/create', reservationController.renderCreateReservation);
router.post('/create', reservationController.createReservation)

// in progress
router.get('/', reservationController.getReservationsByRoomId);

router.get('/countAll', reservationController.getReservationCount);

/*
router.get("/", getAllReservations);
router.put("/:reservationId", updateReservation);
router.delete("/:reservationId", deleteReservation);
*/

module.exports = router;
