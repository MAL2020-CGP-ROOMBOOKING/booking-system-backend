const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");

router.get('/create', roomController.renderCreateRoom);
router.post('/create', roomController.postCreateRoom);

router.get('/countAll', roomController.getRoomCount);

router.get('/all', roomController.getAllRooms);
router.get('/:roomId', roomController.getRoomById); // Keep this last, otherwise bugs might appear.

/*
router.put("/:roomId", updateRoom);
router.delete("/:roomId", deleteRoom);
*/

module.exports = router;