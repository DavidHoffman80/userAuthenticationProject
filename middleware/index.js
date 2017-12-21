function loggedOut(req, res, next){
  if(req.session && req.session.userId){
    return res.redirect('/profile');
  }
  return next();
}

function loginReq(req, res, next){
  if(req.session && req.session.userId){
    return next();
  } else{
    var err = new Error('You must be logged in to view this page. You fucking dumb ass hacker!!!');
    err.status = 401;
    return next(err);
  }
}

module.exports.loggedOut = loggedOut;
module.exports.loginReq = loginReq;