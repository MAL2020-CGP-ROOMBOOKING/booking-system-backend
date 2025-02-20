const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDB } = require("../config/db");
const { authenticateToken } = require("../middleware/authMiddleware");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// test

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('userCreate');
});

app.post('/userCreate', (req, res) => {
    
});

// end test

connectDB().then(() => {
    const { authMiddleware } = require("../middleware/authMiddleware");

    app.use("/api/users", authMiddleware, require("../routes/userRoutes"));
    app.use("/api/admins", authMiddleware, require("../routes/adminRoutes"));
    app.use("/api/rooms", authMiddleware, require("../routes/roomRoutes"));
    app.use("/api/feedback", authMiddleware, require("../routes/feedbackRoutes"));
    app.use("/api/announcements", authMiddleware, require("../routes/announcementRoutes"));
    app.use("/api/reservations", authMiddleware, require("../routes/reservationRoutes"));
    app.use("/api/logs", authMiddleware, require("../routes/logRoutes"));
    
    app.use("/api/auth", require("../routes/authRoutes"));
    

    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
});