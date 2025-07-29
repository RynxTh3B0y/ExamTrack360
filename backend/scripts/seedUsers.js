const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const demoUsers = [
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@examtrack360.com',
    password: 'password123',
    role: 'admin',
    phone: '+1234567890',
    isActive: true,
    grade: null,
    section: null,
    subjects: [],
    preferences: {
      theme: 'light',
      notifications: {
        email: true,
        sms: false
      }
    }
  },
  {
    firstName: 'John',
    lastName: 'Teacher',
    email: 'teacher@examtrack360.com',
    password: 'password123',
    role: 'teacher',
    teacherId: 'T001',
    phone: '+1234567891',
    isActive: true,
    grade: '10',
    section: 'A',
    subjects: ['Mathematics', 'Physics'],
    preferences: {
      theme: 'light',
      notifications: {
        email: true,
        sms: false
      }
    }
  },
  {
    firstName: 'Sarah',
    lastName: 'Student',
    email: 'student@examtrack360.com',
    password: 'password123',
    role: 'student',
    studentId: 'S001',
    phone: '+1234567892',
    isActive: true,
    grade: '10',
    section: 'A',
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],
    preferences: {
      theme: 'light',
      notifications: {
        email: true,
        sms: false
      }
    }
  }
];

async function seedUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/examtrack360');
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Hash passwords and create users
    const hashedUsers = await Promise.all(
      demoUsers.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 12);
        return {
          ...user,
          password: hashedPassword
        };
      })
    );

    // Insert users
    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`Created ${createdUsers.length} demo users:`);
    
    createdUsers.forEach(user => {
      console.log(`- ${user.role}: ${user.email}`);
    });

    console.log('\nDemo users seeded successfully!');
    console.log('\nYou can now login with:');
    console.log('Admin: admin@examtrack360.com / password123');
    console.log('Teacher: teacher@examtrack360.com / password123');
    console.log('Student: student@examtrack360.com / password123');

  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function
seedUsers(); 