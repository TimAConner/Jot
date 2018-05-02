const { Strategy } = require("passport-local");
const { Strategy: RememberMeStrategy } = require('passport-remember-me-extended');
const { hashSync, genSaltSync, compareSync } = require('bcrypt-nodejs');
const { generateToken } = require('./generateToken');

const generateHash = password => {
  return hashSync(password, genSaltSync(8));
}

const isValidPassword = (userpass, password) => {
  // hashes the passed-in password and then compares it to the hashed password fetched from the db
  return compareSync(password, userpass);
};

const { User, Token } = require('../../sequelize/models/');

// let Token = require('../data/token');

// let configAuth = require('./authentication');

module.exports = function (passport) {


  // Passport session setup; required for persistent login sessions.
  // Passport needs the ability to serialize and deserialize users out of the session.
  passport.serializeUser(function (user, done) {
    console.log('SERIALIZE USER', user);
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    console.log('DESERIALIZE USER', user.id);
    User.findById(user.id).then(user => {
      if (user) {
        console.log('DESERIALIZED USER', user.get());
        done(null, user.get());
      } else {
        console.log('CANT DESERIALIZE');
        done(user.errors, null);
      }
    });
  });

  // Local Signup
  // We are using named strategies since we have ones for login, signup and connect.
  // By default, if there was no name, it would just be called 'local'.
  passport.use('local-signup', new Strategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true // Allows us to pass back the entire request to the callback.
  },
    function (req, email, password, done) {
      console.log('BEFORE TICK IN LOCAL SIGN UP');
      // Asynchronous; User.findOne wont fire unless data is sent back.
      process.nextTick(function () {
        console.log('LOCAL SIGNUP');

        // Find a user whose username is the same as the form's username.
        // We are checking to see if the user trying to login already exists.
        User.findOne({
          where: { email }
        }).then(user => {

          //  If no user, then a user can be created.
          if (!user) {
            const userPassword = generateHash(password);
            const creation_date = new Date().getTime();
            // values come from the req.body, added by body-parser when register form request is submitted
            const userData = {
              email,
              password: userPassword,
              display_name: req.body.display_name,
              creation_date,
            };

            // Save the user.
            User.create(userData).then((newUser, _) => {
              if (!newUser) {
                return done(null, false);
              }
              if (newUser) {
                console.log("newUser", newUser);
                return done(null, newUser);
              }
            });
          } else {
            return done(new Error("That username is already taken"), false);
          }
        });
      });
    }));

  // Local Login
  // We are using named strategies since we have ones for login, signup and connect.
  // By default, if there was no name, it would just be called 'local'.
  passport.use('local-login', new Strategy({
    // arg 1: declare what request (req) fields our usernameField and passwordField (passport variables) are.
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true // allows us to pass back the entire request to the callback,
    // which is particularly useful for signing up.
  },
    function (req, email, password, done) {
      console.log('IN LOGIN');
      // Check if the user is already logged in.
      if (!req.user) {
        // Find a user whose username is the same as the form's username.
        // We are checking to see if the user trying to login already exists.
        User.findOne({
          where: { email },
          raw: true,
        }).then(user => {
          // If no user is found, return the message.

          if (!user) {
            // req.flash is the way to set flashdata using connect-flash.
            return done(new Error("No user found"), false);
          }
          // console.log('user.password', user.password, "password", password);
          // If the user is found but the password is wrong
          if (!isValidPassword(user.password, password)) {
            // if (password !== "password123") {
            // create the loginMessage and save it to session as flashdata.
            return done(new Error("Wrong password"), false);
          }
          console.log('user found', user);
          return done(null, user);
        });
      } else {

        // WHY IS THIS DATA BEING SAVED TO USER?
        console.log("THE USER IS ALREADY LOGGED IN.  WHAT NOW?")
        // User already exists and is logged in; we have to link accounts.
        let user = req.user;

        // Update the current user's Local details.
        user.local.email = req.body.email;
        user.local.password = password;

        // Save the user.
        user.save(function (err) {
          if (err)
            throw err;
          return done(null, user);
        });
      }
    }));

  passport.use(new RememberMeStrategy(
    function (token, done) {

      // // CHeck if token is there and then delete it and create a new one.
      Token.findOne({ where: { value: token }, raw: true })
        .then(foundToken => {
          console.log('foundToken', foundToken);
          if (foundToken) {
            User.findOne({ where: { email: foundToken.user_email }, raw: true })
              .then(user => {
                console.log('token user', user);
                if (user) {
                  Token.destroy({
                    where: {
                      value: token
                    }
                  }).then(success => {
                    console.log('DELETED  TOKEN AND SSEND NEW TOKEN', success);
                    // return done(null, { id: 1, email: "a@a.com" });
                    return done(null, user);
                  });
                } else {
                  console.log('NO USER ASSOCIATED WITH TOKEN')
                  return done(new Error("No User Associated With Token"), false);
                }
              });
          } else {
            console.log('ELSE TOKEN', token)
            return done(null, false);
          }
        });
      // console.log('TOKEN', token)
      // return done(null, { email: 'a@a.com', id: 1 });
    },
    function (user, done) {
      console.log('user in generate token', user);

      const twoWeeksFromNow = new Date(Date.now() + 12096e5).getTime();
      const token = generateToken(64);
      Token.create({
        value: token,
        expire_date: twoWeeksFromNow,
        user_email: user.email,
      }).then((newToken, _) => {
        console.log('GENERATE TOKEN', token);
        return done(null, token);
      });
    }
  ));
};