const { MongoClient } = require("mongodb");

let db;

async function connectDB() {
    try {
        const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        console.log("✅ Connected to MongoDB");
        db = client.db(process.env.DB_NAME);
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error);
        process.exit(1);
    }
}

function getDB() {
    if (!db) {
        throw new Error("Database not initialized. Call connectDB() first.");
    }
    return db;
}

module.exports = { connectDB, getDB };
