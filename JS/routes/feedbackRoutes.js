const express = require("express");
const { getAllFeedback, getFeedbackById, createFeedback, deleteFeedback } = require("../controllers/feedbackController");

const router = express.Router();

router.get("/", getAllFeedback);
router.get("/:feedbackId", getFeedbackById);
router.post("/", createFeedback);
router.delete("/:feedbackId", deleteFeedback);

module.exports = router;
