const express = require("express");
const { getAllAnnouncements, getAnnouncementById, createAnnouncement, updateAnnouncement, deleteAnnouncement, renderCreateAnnouncement, postCreateAnnouncement } = require("../controllers/announcementController");

const router = express.Router();

router.get('/createAnnouncement', renderCreateAnnouncement);
router.post('/createAnnouncement', postCreateAnnouncement);


/*
router.get("/", getAllAnnouncements);
router.get("/:announcementId", getAnnouncementById);
router.post("/", createAnnouncement);
router.put("/:announcementId", updateAnnouncement);
router.delete("/:announcementId", deleteAnnouncement);
*/

module.exports = router;
