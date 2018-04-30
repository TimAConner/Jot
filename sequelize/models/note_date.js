'use strict';
module.exports = (sequelize, DataTypes) => {
  var Note_Date = sequelize.define('Note_Date', {
    timestamp: DataTypes.DATE
  }, { tableName: 'note_dates', timestamps: false });
  Note_Date.associate = function(models) {
    Note_Date.belongsTo(models.Note, {
      foreignKey: 'note_id'
    });
  };
  return Note_Date;
};