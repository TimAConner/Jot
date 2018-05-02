'use strict';
const models = require('./models');
const { hashSync, genSaltSync } = require('bcrypt-nodejs');

const { keywords } = require('./seeders/keywords');
let { users } = require('./seeders/users');
const { note_dates } = require('./seeders/note_dates');
const { options } = require('./seeders/options');
const { notes } = require('./seeders/notes');

// Hash plain text passwords from json file
users = users.map(user => {
  user.password = hashSync(user.password, genSaltSync(8));
  return user;
});

models.sequelize.sync({ force: true })
  .then(() => {
    return models.User.bulkCreate(users);
  })
  .then(() => {
    return models.Note.bulkCreate(notes);
  })
  .then(() => {
    return models.Note_Date.bulkCreate(note_dates);
  })
  .then(() => {
    return models.Keyword.bulkCreate(keywords);
  })
  .then(() => {
    return models.Option.bulkCreate(options);
  })
  .then(() => {
    process.exit();
  })
  .catch(err => {
    console.log('ERROR', err);
    process.exit();
  });