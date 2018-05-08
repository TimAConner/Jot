const { loginFailure } = require('../controllers/authCtrl');

module.exports.isLoggedIn = (req, res, next) => {

  if (typeof req.user === "undefined") {
    return loginFailure(req, res, next);
  }

  next();
};