const express = require("express");
const { updateUser, deleteUser, postCreateUser, renderCreateUser, renderLoginUser, postLoginUser, renderDashboard } = require("../controllers/userController");

const router = express.Router();

router.get('/register', renderCreateUser);
router.post('/register', postCreateUser);

// router.patch('/update', updateUser);

router.get('/dashboard', renderDashboard);
/*
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser); can use Patch instead
router.delete("/:id", deleteUser);
*/

module.exports = router;