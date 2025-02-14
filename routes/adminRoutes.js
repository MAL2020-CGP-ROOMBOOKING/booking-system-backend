const express = require("express");
const { getAllAdmins, getAdminById, createAdmin, updateAdmin, deleteAdmin } = require("../controllers/adminController");

const router = express.Router();

router.get("/", getAllAdmins);
router.get("/:adminId", getAdminById);
router.post("/", createAdmin);
router.put("/", updateAdmin);  
router.delete("/", deleteAdmin); 

module.exports = router;
