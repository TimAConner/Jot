'use strict';
const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateTokenString = length => {
  const token = [];
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charlen = chars.length;

  for (let i = 0; i < length; ++i) {
    token.push(chars[randomInt(0, charlen - 1)]);
  }

  return token.join('');
};

module.exports.createToken = (user) => {
  const { Token } = require('../sequelize/models');
  const twoWeeksFromNow = new Date(Date.now() + 12096e5).getTime();
  const token = generateTokenString(64);

  return Token.create({
    value: token,
    expire_date: twoWeeksFromNow,
    user_email: user.email,
  });
};