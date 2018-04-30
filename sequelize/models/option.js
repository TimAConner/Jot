'use strict';
module.exports = (sequelize, DataTypes) => {
  var Option = sequelize.define('Option', {
    font_size: DataTypes.SMALLINT,
    font_style: DataTypes.STRING,
    auto_keyword_style: DataTypes.STRING,
    user_keyword_style: DataTypes.STRING
  }, {});
  Option.associate = function(models) {
    Option.belongsTo(models.User, {
      foreignKey: 'user_id'
    });
  };
  return Option;
};