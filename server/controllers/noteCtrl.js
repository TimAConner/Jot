'use strict';

const { generateKeywords } = require('./watsonCtrl');

const saveKeywords = ({ KeywordModel, keywords, noteId, userSelected }) => {
  return new Promise((resolve, reject) => {
    const keywordPromiseArray = keywords.map(keyword => {
      return (KeywordModel.create({
        keyword,
        user_selected: userSelected,
        note_id: noteId,
      }));
    });

    Promise.all(keywordPromiseArray).then(success => {
      resolve(success);
    })
      .catch(err => next(err));
  });
};

const insertNoteOrCreateNote = ({ sequelize, noteId, text, userId }) => {
  return (sequelize.query(` 
  INSERT INTO notes (id, text, user_id)
  VALUES (${noteId},'${text}', ${userId})
  ON CONFLICT (id) DO UPDATE
    SET text = '${text}';`, {
      type: sequelize.QueryTypes.INSERT
    }));
};

const createDateIfNew = ({ sequelize, noteId }) => {
  return new Promise((resolve, reject) => {
    const currentDate = (Date.now() / 1000.0);
    sequelize.query(`
    INSERT INTO note_dates (edit_date, note_id)
    SELECT to_timestamp(${currentDate}), ${noteId}
    WHERE NOT EXISTS (
          SELECT edit_date
          FROM note_dates
          WHERE edit_date >= to_timestamp(${currentDate}) - interval '1 day'
            and edit_date <= to_timestamp(${currentDate}) 
      );`).then(([_, rowsInserted]) => {
        resolve();
      });
  });

};

const clearOldKeywords = ({ Keyword, noteId }) => {
  return (Keyword.destroy({
    where: {
      note_id: noteId,
    },
  }));
};

module.exports.getOneNote = (req, res, next) => {
  const { Note, Keyword, Note_Date } = req.app.get('models');

  const noteId = req.params.id;
  Note.findAll({
    include: [{
      model: Keyword,
      attributes: {
        exclude: ['id', 'note_id'],
      },
    }, {
      model: Note_Date,
      limit: 1,
      order: [['edit_date', 'DESC']],
      attributes: {
        exclude: ['id'],
      },
    }],
    where: {
      id: noteId,
    },
  })
    .then(([note]) => {
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
      attributes: {
        exclude: ['id', 'note_id'],
      },
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

  // Escape ' characterse since that is how postgres holds strings
  const text = req.body.text.replace("'", "''");
  const userId = req.user.id;
  const selectedKeywords = req.body.keywords;

  insertNoteOrCreateNote({ sequelize, noteId, userId, text })
    .then(([_, success]) => {

      // Delete all previous keywords with this note.  
      // This needs to be done since a user can update a note
      // and select 3 keywords instead of 5.
      // The extra 2 would not be updated if they only sent in three.
      return clearOldKeywords({ Keyword, noteId });
    })
    .then(created => {

      // User has not selected keywords
      // Watson will select keywords
      if (!selectedKeywords) {
        generateKeywords(text).then(keywords => {
          return saveKeywords({
            KeywordModel: Keyword,
            keywords,
            noteId,
            userSelected: false,
          });
        });
      }

      // User has selected keywords
      if (selectedKeywords) {
        return saveKeywords({
          KeywordModel: Keyword,
          keywords: selectedKeywords,
          noteId,
          userSelected: true
        });
      }
    })
    .then(() => {
      return createDateIfNew({ sequelize, noteId })
    })
    .then(() => {
      res.status(200).send();
    })
    .catch(err => next(err));
};