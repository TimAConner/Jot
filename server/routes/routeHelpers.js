module.exports.isLoggedIn = (req, res, next) => {

  if (typeof req.user === "undefined") {
    return res.redirect('/login');
  }

  next();
};