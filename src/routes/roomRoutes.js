const express = require("express");
const { getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom, postCreateRoom, renderCreateRoom } = require("../controllers/roomController");

const router = express.Router();

router.get('/createRoom', renderCreateRoom);
router.post('/createRoom', postCreateRoom);

/*
router.get("/", getAllRooms);
router.get("/:roomId", getRoomById);
router.post("/", createRoom);
router.put("/:roomId", updateRoom);
router.delete("/:roomId", deleteRoom);
*/

module.exports = router;