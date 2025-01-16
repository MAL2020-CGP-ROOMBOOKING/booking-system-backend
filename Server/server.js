const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// MongoDB connection details
const uri = 'mongodb://127.0.0.1:27017'; // Change if your MongoDB is hosted elsewhere
const dbName = 'sampledb'; // Replace with your database name
let db;

// Connect to MongoDB
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db(dbName);
  })
  .catch(err => console.error(err));

// Routes
// Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await db.collection('users').find().toArray();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Add a new user
app.post('/users', async (req, res) => {
  try {
    const user = req.body;
    const result = await db.collection('users').insertOne(user);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add user' });
  }
});

// Update a user by ID
app.put('/users/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete a user by ID
app.delete('/users/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
