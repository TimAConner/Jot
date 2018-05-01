'use strict';
module.exports = (sequelize, DataTypes) => {
  var Note_Date = sequelize.define('Note_Date', {
    edit_date: DataTypes.DATE
  }, { tableName: 'note_dates', timestamps: false });
  Note_Date.associate = function(models) {
    Note_Date.belongsTo(models.Note, {
      foreignKey: {
        name: 'note_id',
        allowNull: false
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  return Note_Date;
};