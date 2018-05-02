'use strict';
module.exports = (sequelize, DataTypes) => {
  var Token = sequelize.define('Token', {
    value: DataTypes.STRING,
    user_email: DataTypes.STRING,
    expire_date: DataTypes.DATE
  }, { tableName: 'tokens', timestamps: false });
  Token.associate = function(models) {
    // associations can be defined here
  };
  return Token;
};