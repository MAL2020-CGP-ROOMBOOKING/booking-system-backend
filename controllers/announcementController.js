const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

exports.getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await getDB().collection("announcements").find().toArray();
        res.json(announcements);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch announcements" });
    }
};

exports.getAnnouncementById = async (req, res) => {
    try {
        const announcement = await getDB().collection("announcements").findOne({ _id: new ObjectId(req.params.announcementId) });
        if (!announcement) return res.status(404).json({ error: "Announcement not found" });
        res.json(announcement);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch announcement" });
    }
};

exports.createAnnouncement = async (req, res) => {
    try {
        const { time, title, body } = req.body;
        
        if (!title || !body) {
            return res.status(400).json({ error: "Title and body are required" });
        }

        const result = await getDB().collection("announcements").insertOne({
            time: time ? new Date(time) : new Date(), // Convert time to Date if provided
            title,
            body,
            createdAt: new Date()
        });

        res.status(201).json({ message: "Announcement posted", id: result.insertedId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add announcement" });
    }
};


exports.updateAnnouncement = async (req, res) => {
    try {
        const { announcementId } = req.params; // Get ID from request params
        const { time, title, body } = req.body;

        if (!ObjectId.isValid(announcementId)) {
            return res.status(400).json({ error: "Invalid announcement ID format" });
        }

        const result = await getDB().collection("announcements").updateOne(
            { _id: new ObjectId(announcementId) },
            { $set: { time: time ? new Date(time) : new Date(), title, body } }
        );

        if (!result.matchedCount) {
            return res.status(404).json({ error: "Announcement not found" });
        }

        res.json({ message: "Announcement updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update announcement" });
    }
};



exports.deleteAnnouncement = async (req, res) => {
    try {
        const result = await getDB().collection("announcements").deleteOne({ _id: new ObjectId(req.params.announcementId) });
        if (!result.deletedCount) return res.status(404).json({ error: "Announcement not found" });
        res.json({ message: "Announcement deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete announcement" });
    }
};
