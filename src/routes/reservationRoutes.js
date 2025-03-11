const express = require("express");
const { getAllReservations, getReservationById, createReservation, updateReservation, deleteReservation, renderCreateReservation } = require("../controllers/reservationController.js");

const router = express.Router();

router.get('/createReservation', renderCreateReservation);

router.post('/createReservation', createReservation)

/*
router.get("/", getAllReservations);
router.get("/:reservationId", getReservationById);
router.post("/", createReservation);
router.put("/:reservationId", updateReservation);
router.delete("/:reservationId", deleteReservation);
*/

module.exports = router;
