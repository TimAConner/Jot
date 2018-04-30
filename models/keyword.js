'use strict';
module.exports = (sequelize, DataTypes) => {
  var Keyword = sequelize.define('Keyword', {
    keyword: DataTypes.STRING,
    user_selected: DataTypes.BOOLEAN
  }, {});
  Keyword.associate = function(models) {
    // associations can be defined here
  };
  return Keyword;
};