// server/seedUsers.js
const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust the path if necessary
require('dotenv').config(); // Make sure to have dotenv configured if using environment variables

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Database connection error:', err));

// Dummy user data
const dummyUsers = [
  { username: 'Alice', password: 'password123', online: true },
  { username: 'Bob', password: 'password123', online: true },
  { username: 'Charlie', password: 'password123', online: true },
  { username: 'David', password: 'password123', online: true },
  { username: 'Eva', password: 'password123', online: true },
];

// Function to add users
const seedUsers = async () => {
  try {
    // Clear existing users (optional, to avoid duplicate dummy users on each run)
    await User.deleteMany({});
    console.log('Existing users removed.');

    // Insert dummy users
    await User.insertMany(dummyUsers);
    console.log('Dummy users added successfully.');

    // Close the database connection
    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding users:', err);
  }
};

seedUsers();
