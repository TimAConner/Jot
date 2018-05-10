const passport = require('passport');
const { Strategy } = require('passport-local');
const { hashSync, genSaltSync, compareSync } = require('bcrypt-nodejs');

const passportJWT = require("passport-jwt");
const { Strategy: JWTStrategy, ExtractJwt: ExtractJWT } = passportJWT;
const { webTokenSecret } = require('../helpers');

const { User, Token } = require('../../sequelize/models/');

const generateHash = password => {
  return hashSync(password, genSaltSync(8));
};

const RegistrationStrategy = new Strategy({
  usernameField: "email",
  passwordField: "password",
  passReqToCallback: true
}, (req, email, password, done) => {
  console.log("local strat callback: password", email);

  // using the Sequelize user model we initialized earlier as User, we check to see if the user already exists, and if not we add them.
  User.findOne({
    where: { email } // remember, this is object literal shorthand. Same as { email: email}
  }).then(user => {
    if (user) {
      return done(new Error('Email is already taken'), false);
    } else {
      const userPassword = generateHash(password); //function we defined above
      const data = {
        email,
        password: userPassword,
        display_name: req.body.display_name,
      };

      User.create(data).then((newUser, created) => {
        if (!newUser) {
          return done(new Error('User could not be created.  Please try again later.'), false);
        }
        if (newUser) {
          return done(null, newUser.get());
        }
      });
    }
  });
}
);

const LoginStrategy = new Strategy({
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
});


const ExtractUser = new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: "363F73AF69F990568B3F5BA68C89546B66BB86BD462465283A08C51AABB7C06",
}, (jwtPayload, cb) => {
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
);

passport.use('register', RegistrationStrategy);
passport.use('login', LoginStrategy);
passport.use(ExtractUser);