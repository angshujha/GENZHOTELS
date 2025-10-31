const mongoose = require('mongoose');
const Listing = require('../models/listing');
const initData = require('./init.js');
require('dotenv').config(); // Load .env file

// Use ATLAS_DB_URL from .env or fallback to local
const dbUrl = process.env.ATLAS_DB_URL || 'mongodb://127.0.0.1:27017/GENZHOTELS';

async function main() {
  try {
    await mongoose.connect(dbUrl);
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
  }
}

const initdb = async () => {
  try {
    await Listing.deleteMany({});
    console.log('🧹 Old listings deleted');
initData.data = initData.data.map((obj) => ({
  ...obj,
  owner: '69047ce9cec0eb168cfa32ab', // ✅ Ensure this user exists
  category: obj.category || "Luxury Stay", // 👈 Default value if missing
}));

    await Listing.insertMany(initData.data);
    console.log('🌱 New listings added');
  } catch (err) {
    console.error('❌ Error while seeding:', err);
  }
};

main()
  .then(() => initdb())
  .then(() => mongoose.connection.close())
  .then(() => console.log('✅ Database connection closed'))
  .catch((err) => console.error('❌ Error:', err));
