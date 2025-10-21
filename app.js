const express = require('express');
const app = express();
const port = 8080;
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const overwride = require('method-override');
const ejsmate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
app.engine('ejs', ejsmate);
app.use(overwride('_method'));
const path = require('path');
const e = require('express');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

main()
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/GENZHOTELS');
}

app.get('/', (req, res) => {
  res.send('Welcome to GENZ HOTELS!');
});
//index route to display all listings
app.get('/listings', async (req, res) => {
  const listings = await Listing.find({});
  res.render('listings/index.ejs', { listings });
});
//new route to display form to create a new listing
app.get('/listings/new', (req, res) => {
  res.render('listings/new.ejs');
});
//show route to display a single listing
app.get('/listings/:id', async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render('listings/show.ejs', { listing });
});
//  create route to add a new listing
app.post('/listings', wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body);
  await newListing.save();
  res.redirect('/listings');
}));
//edit route to display form to edit a listing
app.get('/listings/:id/edit', async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render('listings/edit.ejs', { listing });
});

//update route to update a listing
app.put('/listings/:id', async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { runValidators: true, new: true });
  res.redirect(`/listings/${id}`);
});
//delete route to delete a listing
app.delete('/listings/:id', async (req, res) => {
  const { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect('/listings');
});
app.use((err, req, res, next) => {
  const { status = 500, message = 'Something went wrong' } = err;
  res.status(status).send(message);
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});