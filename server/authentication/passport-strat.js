const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { hashSync, genSaltSync, compareSync } = require('bcrypt-nodejs');

const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const { User, Token } = require('../../sequelize/models/');



passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,

}, (req, email, password, cb) => {
  const isValidPassword = (userpass, password) => {
    // hashes the passed-in password and then compares it to the hashed password fetched from the db
    return compareSync(password, userpass);
  };

  User.findOne({ where: { email } })
    .then(user => {
      console.log('user', user);
      if (!user) {
        return cb(new Error('Can not find a user with those credentials. Please try again.'), false);
      }
      if (req.body.username != user.username) {
        return cb(new Error('Wrong email.  Please try again.'), false);
      }
      if (!isValidPassword(user.password, password)) {
        return cb(new Error('Incorrect password'), false);
      }
      const userinfo = user.get(); // get returns the data about the object, separate from the rest of the instance Sequelize gives us after calling 'fincb()' above. Could also have added {raw: true} to the query to achieve the same thing

      return cb(null, userinfo);
    })
    .catch(err => {
      console.log("Error:", err);
      return cb(new Error('Please try again later.'), false);
    });
}
));

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your_jwt_secret'
},
  function (jwtPayload, cb) {
    User.findOne({
      where: {
        email:
          jwtPayload.email
      }
    })
      .then(user => {
        return cb(null, user);

      })
      .catch(err => {
        return cb(err);
      });
  }
));