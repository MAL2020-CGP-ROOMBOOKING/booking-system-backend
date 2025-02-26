const express = require("express");
const { createAdmin, updateAdmin, deleteAdmin, renderCreateAdmin, renderLoginAdmin, postCreateAdmin, postLoginAdmin } = require("../controllers/adminController");

const router = express.Router();

router.get('/createAdmin', renderCreateAdmin);
router.post('/createAdmin', postCreateAdmin);

router.get('/loginAdmin', renderLoginAdmin);
router.post('/loginAdmin', postLoginAdmin);

//patch for update

/*
router.get("/", getAllAdmins);
router.get("/:adminId", getAdminById);
router.post("/", createAdmin);
router.put("/", updateAdmin);  
router.delete("/", deleteAdmin);
*/

module.exports = router;
