const express = require("express");
const { login, renderLogin, postLogin } = require("../controllers/authController");
const router = express.Router();

router.get("/login", renderLogin);
router.post("/login", postLogin);

module.exports = router;
