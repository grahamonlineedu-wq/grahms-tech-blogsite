const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI || process.env.MONGO_URI.includes('abcde') || process.env.MONGO_URI.includes('your-cluster')) {
      console.log('⚠️ Running server in local static mode (No active database connection).');
      return;
    }
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 3000 });
    console.log('✅ MongoDB Connected Successfully');
  } catch (err) {
    console.log('⚠️ MongoDB Connection Failed:', err.message);
    console.log('🚀 App will continue running without database blocking.');
  }
};

module.exports = connectDB;
