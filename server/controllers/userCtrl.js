'use strict';

module.exports.getUserInfo = (req, res, next) => {
  const { User, Option } = req.app.get('models');

  const userId = req.user.id;
  User.findAll({
    include: [{
      model: Option,
      attributes: {
        exclude: ['id', 'user_id'],
      },
    }],
    where: {
      id: userId,
    },
    attributes: {
      exclude: ['password'],
    },
  })
    .then(([userInfo]) => {
      res.status(200).json(userInfo);
    })
    .catch(err => next(err));
};