'use strict';

const _getUser = ({ userId, User, Option }) => {
  return (User.findAll({
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
  }));
};

module.exports.fetchUser = (req, res, next) => {
  const { User, Option } = req.app.get('models');

  const userId = req.user.id;

  _getUser({ userId, User, Option }).then(([userInfo]) => {
    res.status(200).json(userInfo);
  })
    .catch(err => next(err));
};

module.exports.updateOption = (req, res, next) => {
  const { User, Option } = req.app.get('models');

  const userId = req.user.id;

  const {
    font_size,
    font_style,
    auto_keyword_style,
    user_keyword_style,
  } = req.body;

  const updateObject = {
    user_id: userId,
  };

  // Only add values to patch object if present on req.body.
  if (typeof font_size !== undefined) updateObject.font_size = font_size;
  if (typeof font_style !== undefined) updateObject.font_style = font_style;
  if (typeof auto_keyword_style !== undefined) updateObject.auto_keyword_style = auto_keyword_style;
  if (typeof user_keyword_style !== undefined) updateObject.user_keyword_style = user_keyword_style;

  Option.update(updateObject, {
    where: {
      user_id: userId,
    },
  })
    .then(([rowsUpdated]) => {
      _getUser({ userId, User, Option }).then(([userInfo]) => {
        res.status(200).json(userInfo);
      })
        .catch(err => next(err));
    })
    .catch(err => next(err));
};