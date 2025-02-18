const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

exports.getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await getDB().collection("feedback").find().toArray();

        res.json(feedbacks);
    } catch (err) {
        console.error("Error fetching feedback:", err);
        res.status(500).json({ error: "Failed to fetch feedback", details: err.message });
    }
};

exports.getFeedbackById = async (req, res) => {
    try {
        const { feedbackId } = req.params;

        if (!ObjectId.isValid(feedbackId)) {
            return res.status(400).json({ error: "Invalid feedback ID format" });
        }

        const feedback = await getDB().collection("feedback").findOne({ _id: new ObjectId(feedbackId) });


        if (!feedback) return res.status(404).json({ error: "Feedback not found" });

        res.json(feedback);
    } catch (err) {
        console.error("Error fetching feedback:", err);
        res.status(500).json({ error: "Failed to fetch feedback", details: err.message });
    }
};

exports.createFeedback = async (req, res) => {
    try {
        const { userId, feedbackTitle, feedbackBody, rating } = req.body;

        if (!userId || !feedbackTitle || !feedbackBody || rating == null) {
            return res.status(400).json({ error: "User ID, feedback title, feedback body, and rating are required" });
        }

        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid User ID format" });
        }

        if (typeof rating !== "number" || rating < 1 || rating > 5) {
            return res.status(400).json({ error: "Rating must be a number between 1 and 5" });
        }

        const newFeedback = {
            userId: new ObjectId(userId),
            title: feedbackTitle.trim(),
            body: feedbackBody.trim(),
            rating,
            createdAt: new Date()
        };

        const result = await getDB().collection("feedback").insertOne(newFeedback);


        if (!result.insertedId) {
            return res.status(500).json({ error: "Failed to create feedback" });
        }

        res.status(201).json({ message: "Feedback submitted", id: result.insertedId });
    } catch (err) {
        console.error("Error creating feedback:", err);
        res.status(500).json({ error: "Failed to add feedback", details: err.message });
    }
};

exports.deleteFeedback = async (req, res) => {
    try {
        const { feedbackId } = req.params;
        if (!ObjectId.isValid(feedbackId)) {
            return res.status(400).json({ error: "Invalid feedback ID format" });
        }

        const actorId = req.user?.id || "system";
        const actorType = req.user?.role || "system";

        const result = await getDB().collection("feedback").deleteOne({ _id: new ObjectId(feedbackId) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Feedback not found" });
        }

        // Log entry
        const logEntry = {
            actorId: new ObjectId(actorId),
            actorType,
            action: "FEEDBACK_DELETED",
            details: { feedbackId },
            timestamp: new Date()
        };

        await getDB().collection("logs").insertOne(logEntry);

        res.json({ message: "Feedback deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete feedback", details: err.message });
    }
};
