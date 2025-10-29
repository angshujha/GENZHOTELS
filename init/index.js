const mongoose = require('mongoose');
const Listing = require('../models/listing');
const initData = require('./init.js');

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/GENZHOTELS');
  console.log('✅ Connected to MongoDB');
}

const initdb = async () => {
  await Listing.deleteMany({});
  console.log('🧹 Old listings deleted');

  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: '69017aeda0092745d1e2f21b', // ✅ Ensure this user exists
  }));

  await Listing.insertMany(initData.data);
  console.log('🌱 New listings added');
};

main()
  .then(() => initdb()) // Waits for DB connection, then runs initdb
  .then(() => mongoose.connection.close()) // Close after seeding
  .then(() => console.log('✅ Database connection closed'))
  .catch((err) => console.error('❌ Error:', err));
