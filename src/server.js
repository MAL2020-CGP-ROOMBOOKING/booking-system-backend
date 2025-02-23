require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB, getDB } = require("./config/db");
const { authenticateToken } = require("./middleware/authMiddleware");
const { get } = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    res.render('userHome');
});

connectDB().then(() => {
    //const { authMiddleware } = require("./middleware/authMiddleware");
    // temp removal of authMiddleware
    
    app.use("/users", require("./routes/userRoutes"));
    app.use("/admins", require("./routes/adminRoutes"));
    app.use("/rooms", require("./routes/roomRoutes"));
    app.use("/feedback", require("./routes/feedbackRoutes"));
    app.use("/announcements", require("./routes/announcementRoutes"));
    app.use("/reservations", require("./routes/reservationRoutes"));
    app.use("/logs", require("./routes/logRoutes"));
    
    app.use("/auth", require("./routes/authRoutes"));

    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
});