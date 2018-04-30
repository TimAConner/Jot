'use strict';
module.exports = (sequelize, DataTypes) => {
  var Note = sequelize.define('Note', {
    text: DataTypes.STRING
  }, {});
  Note.associate = function (models) {
    Note.hasOne(models.User, {
      foreignKey: 'user_id'
    });
    Note.hasMany(models.Keyword, {
      foreignKey: 'note_id'
    });
    Note.hasMany(models.Note_Date, {
      foreignKey: 'note_id'
    });
  };
  return Note;
};