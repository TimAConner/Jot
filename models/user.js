'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    display_name: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    creation_date: DataTypes.TIMESTAMP
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Note, {
      foreignKey: 'user_id'
    });
    User.hasOne(models.Option, {
      foreignKey: 'user_id'
    });
  };
  return User;
};