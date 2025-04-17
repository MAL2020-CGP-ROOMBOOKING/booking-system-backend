const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");

router.get("/", feedbackController.getAllFeedback);
router.get("/:feedbackId", feedbackController.getFeedbackById);
router.post("/", feedbackController.createFeedback);
router.delete("/:feedbackId", feedbackController.deleteFeedback);

module.exports = router;