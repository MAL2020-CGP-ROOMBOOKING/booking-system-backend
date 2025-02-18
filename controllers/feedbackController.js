const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

// Fetch all feedback
exports.getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await getDB().collection("feedback").find().toArray();
        res.json(feedbacks);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch feedback", details: err.message });
    }
};

// Fetch a single feedback by ID
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
        res.status(500).json({ error: "Failed to fetch feedback", details: err.message });
    }
};

// Create new feedback
exports.createFeedback = async (req, res) => {
    try {
        const actorId = req.user?.id || "system";
        const actorType = req.user?.role || "system";

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

        // Log entry
        const logEntry = {
            actorId: new ObjectId(actorId),
            actorType,
            action: "FEEDBACK_CREATED",
            details: { feedbackId: result.insertedId, title: feedbackTitle },
            timestamp: new Date()
        };

        await getDB().collection("logs").insertOne(logEntry);

        res.status(201).json({ message: "Feedback submitted", id: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: "Failed to add feedback", details: err.message });
    }
};

// Update feedback
exports.updateFeedback = async (req, res) => {
    try {
        const { feedbackId } = req.params;
        if (!ObjectId.isValid(feedbackId)) {
            return res.status(400).json({ error: "Invalid feedback ID format" });
        }

        const actorId = req.user?.id || "system";
        const actorType = req.user?.role || "system";

        const updateFields = {};
        if (req.body.feedbackTitle) updateFields.title = req.body.feedbackTitle.trim();
        if (req.body.feedbackBody) updateFields.body = req.body.feedbackBody.trim();
        if (req.body.rating != null) {
            if (typeof req.body.rating !== "number" || req.body.rating < 1 || req.body.rating > 5) {
                return res.status(400).json({ error: "Rating must be a number between 1 and 5" });
            }
            updateFields.rating = req.body.rating;
        }

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ error: "At least one field is required to update" });
        }

        const result = await getDB().collection("feedback").updateOne(
            { _id: new ObjectId(feedbackId) },
            { $set: updateFields }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Feedback not found" });
        }

        // Log entry
        const logEntry = {
            actorId: new ObjectId(actorId),
            actorType,
            action: "FEEDBACK_UPDATED",
            details: { feedbackId, updatedFields: updateFields },
            timestamp: new Date()
        };

        await getDB().collection("logs").insertOne(logEntry);

        res.json({ message: "Feedback updated successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to update feedback", details: err.message });
    }
};

// Delete feedback
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
