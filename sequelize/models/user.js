'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    display_name: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    creation_date: DataTypes.DATE
  }, { tableName: 'users', timestamps: false });
  User.associate = function(models) {
    User.hasMany(models.Note, {
      foreignKey: 'user_id'
    });
    User.hasOne(models.Option, {
      foreignKey: {
        name: 'user_id',
        allowNull: false
      },
    });
  };
  return User;
};