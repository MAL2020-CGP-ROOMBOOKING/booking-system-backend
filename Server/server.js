const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDB } = require("./config/db");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

connectDB().then(() => {
    app.use("/api/users", require("./routes/userRoutes"));

    app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
});
