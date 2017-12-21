var express = require('express');
var router = express.Router();
var User = require('../models/user');
var mid = require('../middleware');

// GET /profile
router.get('/profile', mid.loginReq, function(req, res, next) {
  User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
          return res.render('profile', { title: 'Profile', name: user.firstName, favorite: user.favoriteBook });
        }s
      });
});

//GET /logout
router.get('/logout', function(req, res, next){
  if(req.session){
    // Clear the cookie on the client
    res.clearCookie('connect.sid', { path: '/' });
    // Delet session object
    req.session.destroy(function(err){
      if(err){
        return next(err);
      } else{
        return res.redirect('/');
      }
    });
  }
});

// GET /login
router.get('/login', mid.loggedOut, function(req, res, next){
  return res.render('login', { title: 'Log in'});
});

// POST /login
router.post('/login', function(req, res, next){
  if(req.body.email && req.body.password){
    User.authenticate(req.body.email, req.body.password, function(error, user){
      if(error || !user){
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else{
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  } else{
    var err = new Error('Email and password are required.');
    err.status = 401;
    return next(err);
  }
});

// GET /register
router.get('/register', mid.loggedOut, function(req, res, next){
  return res.render('register', { title: 'Sign Up'});
});

// POST /register
router.post('/register', function(req, res, next){
  if(req.body.email &&
    req.body.firstName &&
    req.body.lastName &&
    req.body.favoriteBook &&
    req.body.password &&
    req.body.confirmPassword){
    
      // Confirm that user typed same password twice
      if(req.body.password !== req.body.confirmPassword){
        var err = new Error('Passwords do not match.');
        err.status = 400;
        return next(err);
      }
    
      // Create object with form input
      var userData = {
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        favoriteBook: req.body.favoriteBook,
        password: req.body.password
      };
    
      // Use schema's 'create' method to insert document into Mongo
      User.create(userData, function(error, user){
        if(error){
          return next(error);
        } else{
          req.session.userId = user._id;
          return res.redirect('/profile');
        }
      });
  } else {
    var err = new Error('All fields are required.');
    err.status = 400;
    return next(err);
  }
});

// GET /
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Home' });
});

// GET /about
router.get('/about', function(req, res, next) {
  return res.render('about', { title: 'About' });
});

// GET /contact
router.get('/contact', function(req, res, next) {
  return res.render('contact', { title: 'Contact' });
});

module.exports = router;
