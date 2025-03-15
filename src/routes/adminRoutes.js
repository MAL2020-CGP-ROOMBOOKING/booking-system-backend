const express = require("express");
const { updateAdmin, deleteAdmin, renderCreateAdmin, renderLoginAdmin, postCreateAdmin, postLoginAdmin } = require("../controllers/adminController");
const { getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom, postCreateRoom, renderCreateRoom } = require("../controllers/roomController");

const router = express.Router();

// Admin
router.get('/createAdmin', renderCreateAdmin);
router.post('/createAdmin', postCreateAdmin);

router.get('/loginAdmin', renderLoginAdmin);
router.post('/loginAdmin', postLoginAdmin);

//patch for update

// Room
router.get('/createRoom', renderCreateRoom);
router.post('/createRoom', postCreateRoom);

/*
router.get("/", getAllAdmins);
router.get("/:adminId", getAdminById);
router.post("/", createAdmin);
router.put("/", updateAdmin);  
router.delete("/", deleteAdmin);
*/

module.exports = router;
