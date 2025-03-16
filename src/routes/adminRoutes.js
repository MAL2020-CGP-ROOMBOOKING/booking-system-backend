const express = require("express");
const { updateAdmin, deleteAdmin, renderCreateAdmin, renderLoginAdmin, postCreateAdmin, postLoginAdmin } = require("../controllers/adminController");

const router = express.Router();

// Admin
router.get('/register', renderCreateAdmin);
router.post('/register', postCreateAdmin);

router.get('/login', renderLoginAdmin);
router.post('/login', postLoginAdmin);

//patch for update

// Room
// router.get('/createRoom', renderCreateRoom);
// router.post('/createRoom', postCreateRoom);

/*
router.get("/", getAllAdmins);
router.get("/:adminId", getAdminById);
router.post("/", createAdmin);
router.put("/", updateAdmin);  
router.delete("/", deleteAdmin);
*/

module.exports = router;
