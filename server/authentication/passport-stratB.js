"use strict";

// This module will be executed in app.js.

// module for creating a hash of passwords
const bCrypt = require("bcrypt-nodejs");
const passport = require("passport");

const { Strategy: RememberMeStrategy } = require('passport-remember-me-extended');
const { hashSync, genSaltSync, compareSync } = require('bcrypt-nodejs');
const { createToken } = require('../helpers');


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
    console.log("local strat callback: password", email);

    // using the Sequelize user model we initialized earlier as User, we check to see if the user already exists, and if not we add them.
    User.findOne({
      where: { email } // remember, this is object literal shorthand. Same as { email: email}
    }).then(user => {
      if (user) {
        return done(new Error('Email is already taken'), false);
      } else {
        const userPassword = module.exports.generateHash(password); //function we defined above
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

        if (!user) {
          return done(new Error('Can not find a user with those credentials. Please try again.'), false);
        }
        if (req.body.username != user.username) {
          return done(new Error('Wrong email.  Please try again.'), false);
        }
        if (!isValidPassword(user.password, password)) {
          return done(new Error('Incorrect password'), false);
        }
        const userinfo = user.get(); // get returns the data about the object, separate from the rest of the instance Sequelize gives us after calling 'findOne()' above. Could also have added {raw: true} to the query to achieve the same thing

        return done(null, userinfo);
      })
      .catch(err => {
        console.log("Error:", err);
        return done(new Error('Please try again later.'), false);
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
  // user = {
  //   id: 1,
  //   display_name: 'Karl',
  //   password: '$2a$08$cLsG.PfrPX3E7ToMPLAlNeOpU1bYYJSuSkH31dv4oxKFjRuk7sTR.',
  //   email: 'a@a.com',
  //   creation_date: "1970 - 01 - 18T15: 38: 40.916Z"
  // };
  
  console.log("serialize user", user);
  // This saves the whole user obj into the session cookie,
  // but typically you will see just user.id passed in.
  console.log('user.id', user.id);
  done(null, user.id);
});

// deserialize user
// We use Sequelize's findById to get the user. Then we use the Sequelize getter function, user.get(), to pass the user data to the 'done' function as an object, stripped of the sequelize instance methods, etc.
passport.deserializeUser((id, done) => {
  console.log("deserialize user", id);
  User.findById(id).then(user => {
    if (user) {
      done(null, user.get());
    } else {
      done(new Error('Deserialization error.  Please try again later'), null);
    }
  });
});

// Take the new strategies we just created and use them as middleware, so the http requests get piped through them. A POST to register or login will trigger a strategy, because we will call passport.authenticate in the auth ctrl.
// The first argument is optional and it sets the name of the strategy.
passport.use("local-signup", RegistrationStrategy);
passport.use("local-signin", LoginStrategy);
// passport.use(new RememberMeStrategy(
//   (token, done) => {
//     console.log('consume token', token);
//     // // CHeck if token is there and then delete it and create a new one.
//     Token.findOne({ where: { value: token }, raw: true })
//       .then(foundToken => {

//         console.log('foundToken', foundToken);
//         if (foundToken) {
//           User.findOne({ where: { email: foundToken.user_email }, raw: true })
//             .then(user => {

//               console.log('token user', user);
//               if (user) {
//                 Token.destroy({
//                   where: {
//                     value: token
//                   }
//                 }).then(success => {

//                   console.log('WAS TOKEN DELETED?', success);
//                   return done(null, user);
//                 });
//               } else {

//                 console.log('NO USER ASSOCIATED WITH TOKEN')
//                 return done(null, false, {
//                   message: "No User Associated With Token"
//                 });
//               }
//             });
//         } else {
//           console.log('ELSE TOKEN', token)
//           return done(null, false, {
//             message: "No associated token found"
//           });
//         }
//       });
//   },
//   (user, done) => {
//     console.log('user in generate token', user);
//     createToken(user).then((newToken, _) => {
//       console.log('GENERATE TOKEN', newToken.value);
//       return done(null, newToken.value);
//     });
//   }
// ));