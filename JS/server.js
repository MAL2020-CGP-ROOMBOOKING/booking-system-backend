const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDB } = require("../config/db");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

connectDB().then(() => {
    app.use("/api/users", require("../routes/userRoutes"));
    app.use("/api/admins", require("../routes/adminRoutes"));
    app.use("/api/rooms", require("../routes/roomRoutes"));
    app.use("/api/feedback", require("../routes/feedbackRoutes"));
    app.use("/api/announcements", require("../routes/announcementRoutes"));
    app.use("/api/reservations", require("../routes/reservationRoutes"));
    app.use("/api/logs", require("../routes/logRoutes"));

    app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
});
