'use strict';
module.exports = (sequelize, DataTypes) => {
  var Note = sequelize.define('Note', {
    text: DataTypes.TEXT
  }, { tableName: 'notes', timestamps: false });
  Note.associate = function (models) {
    Note.belongsTo(models.User, {
      foreignKey: {
        name: 'user_id',
        allowNull: false
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Note.hasMany(models.Note_Date, {
     foreignKey: {
        name: 'note_id',
        allowNull: false
      },
    });
    Note.hasMany(models.Keyword, {
      foreignKey: {
        name: 'note_id',
        allowNull: false
      },
    });
  };
  return Note;
};