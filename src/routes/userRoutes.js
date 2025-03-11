const express = require("express");
const { updateUser, deleteUser, postCreateUser, renderCreateUser, renderLoginUser, postLoginUser, renderDashboard } = require("../controllers/userController");

const router = express.Router();

router.get('/createUser', renderCreateUser);
router.post('/createUser', postCreateUser);
router.patch('/updateUser', updateUser);

router.get('/loginUser', renderLoginUser);
router.post('/loginUser', postLoginUser);

router.get('/dashboard', renderDashboard);
/*
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser); can use Patch instead
router.delete("/:id", deleteUser);
*/

module.exports = router;