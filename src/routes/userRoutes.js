const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get('/signup', userController.renderCreateUser);
router.post('/signup', userController.postCreateUser);

// router.patch('/update', updateUser);

router.get('/dashboard', userController.renderDashboard);
/*
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.delete("/:id", deleteUser);
*/

module.exports = router;