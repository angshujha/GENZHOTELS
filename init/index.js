const mongoose = require('mongoose');
const Listing = require('../models/listing');
const { data: initData } = require('./init');

async function main() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/GENZHOTELS');
    console.log('✅ Connected to MongoDB');

    await Listing.deleteMany({});
    console.log('🧹 Old listings deleted');

    console.log('Seeding data:', initData); // 👀 log to check if data is loaded

    await Listing.insertMany(initData);
    console.log('🌱 Sample listings inserted successfully');

    mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

main();
