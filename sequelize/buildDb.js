'use strict';
const models = require('./models');

let { keywords } = require('./seeders/keywords');
let { users } = require('./seeders/users');
let { note_dates } = require('./seeders/note_dates');
let { options } = require('./seeders/options');
let { notes } = require('./seeders/notes');

// TODO: Add password hashing when user is entered into database.

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
    console.log("ERROR", err);
    process.exit();
  });