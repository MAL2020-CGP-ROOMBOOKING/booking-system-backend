const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Admin
// router.get('/signup', adminController.renderCreateAdmin);
// router.post('/signup', adminController.postCreateAdmin);

router.get('/dashboard', adminController.renderDashboard);

router.get('/manage-reservation', adminController.renderManageReservation);

module.exports = router;
