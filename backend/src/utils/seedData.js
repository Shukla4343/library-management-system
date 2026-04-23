const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Direct MongoDB connection and seeding
async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/library_management');
    console.log('Connected to MongoDB');

    // Get the native MongoDB driver
    const db = mongoose.connection.db;
    
    // Drop existing collections if they exist
    const collections = await db.collections();
    for (let collection of collections) {
      await collection.drop();
      console.log(`Dropped collection: ${collection.collectionName}`);
    }
    
    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const userPassword = await bcrypt.hash('user123', salt);
    
    // Create users collection
    const users = [
      {
        username: 'admin',
        password: adminPassword,
        role: 'admin',
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'user',
        password: userPassword,
        role: 'user',
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    await db.collection('users').insertMany(users);
    console.log('✅ Users created successfully');
    
    // Create books collection
    const books = [
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        publishedYear: 1925,
        status: 'available',
        borrowedBy: null,
        borrowedAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        publishedYear: 1960,
        status: 'available',
        borrowedBy: null,
        borrowedAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: '1984',
        author: 'George Orwell',
        publishedYear: 1949,
        status: 'available',
        borrowedBy: null,
        borrowedAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        publishedYear: 1813,
        status: 'available',
        borrowedBy: null,
        borrowedAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        publishedYear: 1951,
        status: 'available',
        borrowedBy: null,
        borrowedAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Moby Dick',
        author: 'Herman Melville',
        publishedYear: 1851,
        status: 'available',
        borrowedBy: null,
        borrowedAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    await db.collection('books').insertMany(books);
    console.log(`✅ Created ${books.length} sample books`);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('   👤 Admin: admin / admin123');
    console.log('   👤 User: user / user123');
    console.log('\n📚 Total books available:', books.length);
    
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();