const express = require("express");
const { getAllLogs, getLogById, createLog } = require("../controllers/logController");

const router = express.Router();

router.post("/", createLog);
router.get("/", getAllLogs);
router.get("/:logId", getLogById);

module.exports = router;
