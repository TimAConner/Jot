'use strict';
module.exports = (sequelize, DataTypes) => {
  var Keyword = sequelize.define('Keyword', {
    keyword: DataTypes.STRING,
    user_selected: DataTypes.BOOLEAN
  }, { tableName: 'keywords', timestamps: false });
  Keyword.associate = function(models) {
    Keyword.belongsTo(models.Note, {
      foreignKey: 'note_id'
    });
  };
  return Keyword;
};