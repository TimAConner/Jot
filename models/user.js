'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    display_name: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    creation_date: DataTypes.TIMESTAMP
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};