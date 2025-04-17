const express = require("express");
const router = express.Router();
const announcementController = require("../controllers/announcementController");

router.get('/create', announcementController.renderCreateAnnouncement);
router.post('/create', announcementController.postCreateAnnouncement);

/*
router.get("/", getAllAnnouncements);
router.get("/:announcementId", getAnnouncementById);
router.put("/:announcementId", updateAnnouncement);
router.delete("/:announcementId", deleteAnnouncement);
*/

module.exports = router;
