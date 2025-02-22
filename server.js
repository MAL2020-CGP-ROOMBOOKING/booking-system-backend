require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB, getDB } = require("./config/db");
const { authenticateToken } = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// test

const bcryptor = require('./modules/bcryptor');

// express.urlencoded() for html forms
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    res.render('userCreate');
});

app.post('/userCreate', async (req, res) => {
    const { name, email, password, phoneNumber, company } = req.body;
    console.log(name, email, password, phoneNumber, company);
    
    const db = getDB();
    const users = db.collection('users');

    const hashedPassword = await bcryptor.hashPassword(password);

    const doc = {
        name,
        email,
        hashedPassword,
        phoneNumber,
        company,
    }

    const result = await users.insertOne(doc);

    console.log(result.insertedId);
    console.log(hashedPassword);

    res.render('userCreate');
});

// end test

connectDB().then(() => {
    const { authMiddleware } = require("./middleware/authMiddleware");

    app.use("/api/users", authMiddleware, require("./routes/userRoutes"));
    app.use("/api/admins", authMiddleware, require("./routes/adminRoutes"));
    app.use("/api/rooms", authMiddleware, require("./routes/roomRoutes"));
    app.use("/api/feedback", authMiddleware, require("./routes/feedbackRoutes"));
    app.use("/api/announcements", authMiddleware, require("./routes/announcementRoutes"));
    app.use("/api/reservations", authMiddleware, require("./routes/reservationRoutes"));
    app.use("/api/logs", authMiddleware, require("./routes/logRoutes"));
    
    app.use("/api/auth", require("./routes/authRoutes"));
    

    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
});