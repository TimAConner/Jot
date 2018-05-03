'use strict';

module.exports.getNote = (req, res, next) => {
  const { Note, Keyword, Note_Date } = req.app.get('models');
  // if (!req.body.noteId) return next();

  const noteId = req.params.id;
  Note.findAll({
    include: [{
      model: Keyword,
    }, {
      model: Note_Date,
      limit: 1,
      order: [['edit_date', 'DESC']],
    }],
    where: {
      id: noteId,
    },
  })
    .then(note => {
      note ? res.status(200).json(note) : res.status(204).sends();
    })
    .catch(err => next(err))
};