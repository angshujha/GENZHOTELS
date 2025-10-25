const express = require('express');
const app = express();
const port = 8080;
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const Review = require('./models/review');
const listingroutes = require('./routers/listing.js');
const reviewroutes = require('./routers/review.js');
const overwride = require('method-override');
const ejsmate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');

app.engine('ejs', ejsmate);
app.use(overwride('_method'));
const path = require('path');
const { listingSchema,reviewSchema } = require('./schema.js');
const review = require('./models/review');

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

const validatereview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) throw new ExpressError(400, error.details[0].message);
  next();
};
app.use('/listings', listingroutes);

app.use('/listings/:id/reviews', reviewroutes);

app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404,'Page Not Found'));
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Something went wrong' } = err;
  res.render('error.ejs', { status, message });
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});