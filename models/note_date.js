'use strict';
module.exports = (sequelize, DataTypes) => {
  var Note_Date = sequelize.define('Note_Date', {
    timestamp: DataTypes.TIMESTAMP
  }, {});
  Note_Date.associate = function(models) {
    // associations can be defined here
  };
  return Note_Date;
};