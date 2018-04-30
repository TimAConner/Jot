'use strict';
module.exports = (sequelize, DataTypes) => {
  var Note = sequelize.define('Note', {
    text: DataTypes.STRING
  }, { tableName: 'notes', timestamps: false });
  Note.associate = function (models) {
    Note.belongsTo(models.User, {
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