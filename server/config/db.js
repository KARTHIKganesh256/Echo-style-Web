import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Check if MongoDB URI is provided
    if (!process.env.MONGODB_URI) {
      console.warn('⚠️  WARNING: MONGODB_URI not found in .env file');
      console.warn('⚠️  Server will run but database features will not work');
      console.warn('⚠️  Please set up MongoDB (see README.md for instructions)');
      return;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️  Server will continue but database features will not work');
    console.warn('⚠️  Options:');
    console.warn('   1. Install MongoDB locally: https://www.mongodb.com/try/download/community');
    console.warn('   2. Use MongoDB Atlas (free): https://www.mongodb.com/cloud/atlas');
    console.warn('   3. Update MONGODB_URI in server/.env file');
    // Don't exit - let server run without DB
  }
};

export default connectDB;
