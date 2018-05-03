'use strict';

module.exports.getOneNote = (req, res, next) => {
  const { Note, Keyword, Note_Date } = req.app.get('models');

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
      res.status(200).json(note);
    })
    .catch(err => next(err))
};

module.exports.getAllNotes = (req, res, next) => {
  const { Note, Keyword, Note_Date } = req.app.get('models');

  const userId = req.user.id;
  Note.findAll({
    include: [{
      model: Keyword,
    }, {
      model: Note_Date,
      limit: 1,
      order: [['edit_date', 'DESC']],
    }],
    where: {
      user_id: userId,
    },
  })
    .then(notes => {
      res.status(200).json(notes);
    })
    .catch(err => next(err))
};