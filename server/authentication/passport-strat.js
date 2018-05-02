"use strict";

// This module will be executed in app.js.

// module for creating a hash of passwords
const bCrypt = require("bcrypt-nodejs");
const passport = require("passport");

const { Strategy: RememberMeStrategy } = require('passport-remember-me-extended');
const { hashSync, genSaltSync, compareSync } = require('bcrypt-nodejs');
const { generateToken } = require('./generateToken');


// initialize the passport-local strategy
const { Strategy } = require("passport-local");


const { User, Token } = require('../../sequelize/models/');


// Then define our custom strategies with our instance of the LocalStrategy.


// add our hashed password generating function inside the callback function
module.exports.generateHash = password => {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(8));
};

//******************** Registration authetication. Takes two args *************************
const RegistrationStrategy = new Strategy(
  // arg 1: declare what request (req) fields our usernameField and passwordField (passport variables) are.
  {
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true // allows us to pass back the entire request to the callback,
    // which is particularly useful for signing up.
  },
  // arg2 callback, handle storing a user's details.
  (req, email, password, done) => {
    console.log("local   strat callback: password", email);

    // using the Sequelize user model we initialized earlier as User, we check to see if the user already exists, and if not we add them.
    User.findOne({
      where: { email } // remember, this is object literal shorthand. Same as { email: email}
    }).then(user => {
      if (user) {
        console.log("user found, oops");

        return done(null, false, {
          message: "That email is already taken"
        });
      } else {
        console.log("in the else");
        const userPassword = module.exports.generateHash(password); //function we defined above
        const data =
          // values come from the req.body, added by body-parser when register form request is submitted
          {
            email,
            password: userPassword,
            display_name: req.body.display_name,
          };
        // create() is a Sequelize method
        User.create(data).then((newUser, created) => {
          if (!newUser) {
            return done(null, false);
          }
          if (newUser) {
            console.log("newUser", newUser);
            return done(null, newUser);
          }
        });
      }
    });
  }
);

// login authentication ****************************************
//LOCAL SIGNIN
const LoginStrategy = new Strategy(
  {
    // by default, local strategy uses username and password, we will override with email
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true // allows us to pass back the entire request to the callback
  },
  (req, email, password, done) => {

    const isValidPassword = (userpass, password) => {
      // hashes the passed-in password and then compares it to the hashed password fetched from the db
      return bCrypt.compareSync(password, userpass);
    };

    User.findOne({ where: { email } })
      .then(user => {
        // console.log("username stuff", user);

        if (!user) {
          return done(null, false, {
            message:
              "Can't find a user with those credentials. Please try again"
          });
        }
        if (req.body.username != user.username) {
          return done(null, false, {
            message: "Wrong username. Please try again"
          });
        }
        if (!isValidPassword(user.password, password)) {
          return done(null, false, {
            message: "Incorrect password."
          });
        }
        const userinfo = user.get(); // get returns the data about the object, separate from the rest of the instance Sequelize gives us after calling 'findOne()' above. Could also have added {raw: true} to the query to achieve the same thing

        return done(null, userinfo);
      })
      .catch(err => {
        console.log("Error:", err);
        return done(null, false, {
          message: "Something went wrong with your sign in"
        });
      });
  }
);

// Passport has to save a user ID in the session to
// manage retrieving the user details when needed.
// It achieves this with the following two methods:

//serialize. In this function, we will be saving the user id to the session in
// req.session.passport.user
passport.serializeUser((user, done) => {
  // console.log("hello, serialize");

  // This saves the whole user obj into the session cookie,
  // but typically you will see just user.id passed in.
  done(null, user);
});

// deserialize user
// We use Sequelize's findById to get the user. Then we use the Sequelize getter function, user.get(), to pass the user data to the 'done' function as an object, stripped of the sequelize instance methods, etc.
passport.deserializeUser(({ id }, done) => {
  User.findById(id).then(user => {
    if (user) {
      done(null, user.get());
    } else {
      done(user.errors, null);
    }
  });
});

// Take the new strategies we just created and use them as middleware, so the http requests get piped through them. A POST to register or login will trigger a strategy, because we will call passport.authenticate in the auth ctrl.
// The first argument is optional and it sets the name of the strategy.
passport.use("local-signup", RegistrationStrategy);
passport.use("local-signin", LoginStrategy);
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
                  console.log('DELETED  TOKEN AND SEND NEW TOKEN', user);
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