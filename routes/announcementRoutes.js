const express = require("express");
const { getAllAnnouncements, getAnnouncementById, createAnnouncement, updateAnnouncement, deleteAnnouncement } = require("../controllers/announcementController");

const router = express.Router();

router.get("/", getAllAnnouncements);
router.get("/:announcementId", getAnnouncementById);
router.post("/", createAnnouncement);
router.put("/:announcementId", updateAnnouncement);
router.delete("/:announcementId", deleteAnnouncement);


module.exports = router;
