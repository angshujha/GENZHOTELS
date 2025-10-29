const User = require('../models/user');

module.exports.rendersignup =  (req, res) => {
  res.render('users/signup.ejs');
};
module.exports.signup = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      res.redirect('/listings');
    });
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/signup');
  }
};
module.exports.renderlogin =  (req, res) => {
  res.render('users/login.ejs');
};
module.exports.login = async (req, res) => {
  req.flash('success', 'Welcome back!');
  let redirecturl = res.locals.redirecturl;
  res.redirect(redirecturl || '/listings');
};
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash('success', 'You have logged out successfully.');
    res.redirect('/listings');
  });
};