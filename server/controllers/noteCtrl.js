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
    .catch(err => next(err));
};

module.exports.deleteNote = (req, res, next) => {
  const { Note } = req.app.get('models');

  // Only the note has to be deleted,
  // becasue the database is setup to cascade delete.
  const noteId = req.params.id;
  Note.destroy({
    where: {
      id: noteId,
    },
  })
    .then(rowsDestroyed => {
      res.status(200).json(rowsDestroyed);
    })
    .catch(err => next(err));
};

module.exports.saveNote = (req, res, next) => {
  const { Note, Keyword, Date_Edit, sequelize } = req.app.get('models');

  const noteId = req.params.id;
  const text = req.body.text;
  const userId = req.user.id;
  const selectedKeywords = req.body.keywords;

  sequelize.query(` 
  INSERT INTO notes (id, text, user_id)
  VALUES (${noteId},'${text}', ${userId})
  ON CONFLICT (id) DO UPDATE
    SET text = '${text}';`, {
      type: sequelize.QueryTypes.INSERT
    }).then(([_, completed]) => {
      res.status(200).json(completed);
    })
    .catch(err => next(err));

  // TODO: Save all keywords, overwriting others if there.
  // TOOD: Save the current edit date if not already in the database.
  // Keyword.destroy({
  //   where: {
  //     note_id: noteId,
  //   },
  // });

  // if (selectedKeywords) {
  //   for (let keyword of selectedKeywords) {
  //     Keyword.upsert({
  //       keyword,
  //       user_selected: true,
  //     },
  //       {
  //         where: {
  //           note_id: noteId,
  //         },
  //       })
  //       .then(created => {
  //         res.status(200).json(created);
  //       })
  //       .catch(err => next(err));
  //   }
  // } else {

  // }

};