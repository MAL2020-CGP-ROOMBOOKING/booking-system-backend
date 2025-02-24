const express = require("express");
const { getAllUsers, getUserById, createUser, updateUser, deleteUser, postCreateUser, renderCreateUser, renderLoginUser, postLoginUser } = require("../controllers/userController");

const router = express.Router();

router.get('/createUser', renderCreateUser);
router.post('/createUser', postCreateUser);
router.patch('/updateUser', updateUser);

router.get('/loginUser', renderLoginUser);
router.post('/loginUser', postLoginUser);

/*
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser); can use Patch instead
router.delete("/:id", deleteUser);
*/

// router.get("/login", /* put controller for login here */);
// router.post("/login", /* put controller for login here */);
module.exports = router;