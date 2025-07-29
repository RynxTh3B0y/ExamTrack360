const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function checkUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/examtrack360');
    console.log('Connected to MongoDB');

    // Find all users
    const users = await User.find({}).select('email role firstName lastName isActive');
    console.log(`Found ${users.length} users in database:`);
    
    users.forEach(user => {
      console.log(`- ${user.role}: ${user.email} (${user.firstName} ${user.lastName}) - Active: ${user.isActive}`);
    });

    // Test specific users
    const adminUser = await User.findOne({ email: 'admin@examtrack360.com' });
    const teacherUser = await User.findOne({ email: 'teacher@examtrack360.com' });
    const studentUser = await User.findOne({ email: 'student@examtrack360.com' });

    console.log('\nSpecific user checks:');
    console.log('Admin user exists:', !!adminUser);
    console.log('Teacher user exists:', !!teacherUser);
    console.log('Student user exists:', !!studentUser);

  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the check function
checkUsers(); 