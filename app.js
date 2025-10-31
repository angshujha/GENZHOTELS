if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}
const dbUrl = process.env.ATLAS_DB_URL || "mongodb://127.0.0.1:27017/GENZHOTELS";

const express = require('express');
const app = express();
const port = 8080;
const mongoose = require('mongoose');
const listingroutes = require('./routers/listing.js');
const reviewroutes = require('./routers/review.js');
const overwride = require('method-override');
const ejsmate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
app.engine('ejs', ejsmate);
app.use(overwride('_method'));
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
const userroutes = require('./routers/user.js');

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret: process.env.SECRET
  }
});
store.on('error', function(e){
  console.log('SESSION STORE ERROR', e);
});


const sessionoptions = {
  store: store,
  secret: process.env.SECRET ,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(session(sessionoptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user;
  next();
});

main()
.then(() => console.log('Connected to MongoDB ATLAS'))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}




app.use('/listings', listingroutes);
app.use('/listings/:id/reviews', reviewroutes);
app.use('/', userroutes);

app.use((req, res, next) => {
  next(new ExpressError(404, 'Page Not Found'));
});



app.use((err, req, res, next) => {
  const { status = 500, message = 'Something went wrong' } = err;
  res.render('error.ejs', { status, message });
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});