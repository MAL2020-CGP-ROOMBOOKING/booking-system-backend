const express = require("express");
const { updateAdmin, deleteAdmin, renderCreateAdmin, renderDashboard, postCreateAdmin } = require("../controllers/adminController");

const router = express.Router();

// Admin
router.get('/register', renderCreateAdmin);
router.post('/register', postCreateAdmin);

//patch for update

router.get('/dashboard', renderDashboard);

/*
router.get("/", getAllAdmins);
router.get("/:adminId", getAdminById);
router.put("/", updateAdmin);  
router.delete("/", deleteAdmin);
*/

module.exports = router;
