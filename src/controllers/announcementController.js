const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

exports.renderCreateAnnouncement = async (req, res) => {
    res.render('announcement-create');
};

exports.postCreateAnnouncement = async (req, res) => {
    try {
        const {title, body} = req.body;

        const db = getDB();

        await db.collection("announcements").insertOne({
            title,
            body,
            time: new Date(),
        });

        res.render('announcement-create');
    } catch {

    }
};

exports.getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await getDB().collection("announcements").find().toArray();

        res.json(announcements);
    } catch (err) {
        console.error("Error fetching announcements:", err);
        res.status(500).json({ error: "Failed to fetch announcements", details: err.message });
    }
};

exports.getAnnouncementById = async (req, res) => {
    try {
        const { announcementId } = req.params;
        if (!ObjectId.isValid(announcementId)) {
            return res.status(400).json({ error: "Invalid announcement ID format" });
        }

        const announcement = await getDB().collection("announcements").findOne({ _id: new ObjectId(announcementId) });


        if (!announcement) return res.status(404).json({ error: "Announcement not found" });

        res.json(announcement);
    } catch (err) {
        console.error("Error fetching announcement:", err);
        res.status(500).json({ error: "Failed to fetch announcement", details: err.message });
    }
};

exports.createAnnouncement = async (req, res) => {
    try {
        const actorId = req.user?.id || "system";
        const actorType = req.user?.role || "system";

        const { time, title, body } = req.body;
        if (!title || !body) {
            return res.status(400).json({ error: "Title and body are required" });
        }

        const newAnnouncement = {
            time: time ? new Date(time) : new Date(),
            title,
            body,
            createdAt: new Date()
        };

        const result = await getDB().collection("announcements").insertOne(newAnnouncement);


        if (!result.insertedId) {
            return res.status(500).json({ error: "Failed to create announcement" });
        }

        const logEntry = {
            actorId: new ObjectId(actorId),
            actorType,
            action: "ANNOUNCEMENT_CREATED",
            details: { announcementId: result.insertedId, title },
            timestamp: new Date()
        };

        await getDB().collection("logs").insertOne(logEntry);

        res.status(201).json({ message: "Announcement posted", id: result.insertedId });
    } catch (err) {
        console.error("Error creating announcement:", err);
        res.status(500).json({ error: "Failed to add announcement", details: err.message });
    }
};

exports.updateAnnouncement = async (req, res) => {
    try {
        const { announcementId } = req.params;
        if (!ObjectId.isValid(announcementId)) {
            return res.status(400).json({ error: "Invalid announcement ID format" });
        }

        const updateFields = {};
        if (req.body.time) updateFields.time = new Date(req.body.time);
        if (req.body.title) updateFields.title = req.body.title;
        if (req.body.body) updateFields.body = req.body.body;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ error: "At least one field is required to update" });
        }

        const result = await getDB().collection("announcements").updateOne(
            { _id: new ObjectId(announcementId) },
            { $set: updateFields }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Announcement not found" });
        }

        res.json({ message: "Announcement updated successfully" });
    } catch (err) {
        console.error("Error updating announcement:", err);
        res.status(500).json({ error: "Failed to update announcement", details: err.message });
    }
};

exports.deleteAnnouncement = async (req, res) => {
    try {
        const { announcementId } = req.params;
        if (!ObjectId.isValid(announcementId)) {
            return res.status(400).json({ error: "Invalid announcement ID format" });
        }

        const result = await getDB().collection("announcements").deleteOne({ _id: new ObjectId(announcementId) });


        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Announcement not found" });
        }

        res.json({ message: "Announcement deleted" });
    } catch (err) {
        console.error("Error deleting announcement:", err);
        res.status(500).json({ error: "Failed to delete announcement", details: err.message });
    }
};