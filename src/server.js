require("dotenv").config();
const express = require("express");
const session = require('express-session');
const { connectDB, client } = require("./config/db");
const { authenticateToken } = require("./middleware/authMiddleware");
const MongoStore = require("connect-mongo")

const app = express();
const PORT = process.env.PORT || 3000;

/* Middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(session({
    store: MongoStore.create({client, dbName: process.env.DB_NAME}),
    secret: 'discoKingCave1111',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } //later learn more
}));

app.get('/', async (req, res) => {
    res.render('landing', {currentPage: 'home', user: null});
});

connectDB().then(() => {
    // const { authMiddleware } = require("./middleware/authMiddleware");
    // temp removal of authMiddleware

    // research how to do something similar to transaction in MSSQL (mongo session)
    
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