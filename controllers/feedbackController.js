const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

exports.getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await getDB().collection("feedback").find().toArray();
        res.json(feedbacks);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch feedback" });
    }
};

exports.getFeedbackById = async (req, res) => {
    try {
        const feedback = await getDB().collection("feedback").findOne({ _id: new ObjectId(req.params.feedbackId) });
        if (!feedback) return res.status(404).json({ error: "Feedback not found" });
        res.json(feedback);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch feedback" });
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

        const newFeedback = {
            userId: new ObjectId(userId),
            title: feedbackTitle,
            body: feedbackBody,
            rating,
            createdAt: new Date()
        };

        const result = await getDB().collection("feedback").insertOne(newFeedback);
        res.status(201).json({ message: "Feedback submitted", id: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: "Failed to add feedback" });
    }
};


exports.deleteFeedback = async (req, res) => {
    try {
        const result = await getDB().collection("feedback").deleteOne({ _id: new ObjectId(req.params.feedbackId) });
        if (!result.deletedCount) return res.status(404).json({ error: "Feedback not found" });
        res.json({ message: "Feedback deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete feedback" });
    }
};
