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
  if (typeof noteId === "undefined") {
    return (sequelize.query(` 
    INSERT INTO notes (text, user_id)
    VALUES ('${text}', ${userId})
    RETURNING id;`, {
        type: sequelize.QueryTypes.INSERT
      }));
  }

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
          SELECT edit_date, note_id
          FROM note_dates
          WHERE edit_date >= to_timestamp(${currentDate}) - interval '1 day'
            AND edit_date <= to_timestamp(${currentDate})
            AND note_id = ${noteId}
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

// When trying to exclude note_id from Note_Date, sequelize throws an error.  
// Excluding note_id when limiting doesn't work right now in sequelize.
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

// When trying to exclude note_id from Note_Date, sequelize throws an error.  
// Excluding note_id when limiting doesn't work right now in sequelize.
module.exports.getAllNotes = (req, res, next) => {
  const { Note, Keyword, Note_Date, sequelize } = req.app.get('models');

  const userId = req.user.id;
  const shouldSortByDate = req.query.dates;
  const shouldGroupByKeyword = req.query.weekView;

  if (shouldGroupByKeyword) {
    return sequelize.query(` 
    SELECT k.keyword, 
    ARRAY_AGG(k.note_id) as notes, DATE_TRUNC('week', nd.edit_date) AS week
    FROM keywords AS k
      LEFT JOIN note_dates AS nd
      ON nd.note_id = k.note_id
      LEFT JOIN notes as n
      ON n.id = k.note_id
    GROUP BY week, k.keyword
    ORDER BY week DESC;
    `, {
        type: sequelize.QueryTypes.SELECT
      })
      .then(keywords => {

        const noteIdsInKeywords = [];

        // Extract the note ids from keywords
        keywords.map(({ notes }) => {
          notes.map(noteId => {

            // To cut down on selects to database
            // Add the note id only if it is not in the array yet
            if (!noteIdsInKeywords.includes(noteId)) {
              noteIdsInKeywords.push(noteId);
            }
          });
        });

        const notePromises = [];

        // Find information on each note referenced 
        // in the keywords found
        noteIdsInKeywords.map(noteId => {
          notePromises.push(
            Note.findAll({
              include: [{
                model: Keyword,
                attributes: {
                  exclude: ['id', 'note_id'],
                },
              }, {
                model: Note_Date,
                order: [['edit_date', 'DESC']],
                limit: 1,
                attributes: {
                  exclude: ['id'],
                },
              }],
              where: {
                id: noteId,
              },
            }));
        });

        // Map the note information onto the keyword results
        Promise.all(notePromises).then(noteInfo => {
          keywords = keywords.map(keyword => {
            keyword.notes = keyword.notes.map(noteId => {
              return noteInfo.find(([obj]) => obj.id == noteId);
            });
            return keyword;
          });

          res.status(200).json(keywords);
        })
          .catch(err => next(err));
      })
      .catch(err => next(err));
  }
  else if (shouldSortByDate) {
    Note_Date.findAll({
      order: [['edit_date', 'DESC']],
      include: [
        {
          model: Note,
          attributes: {
            exclude: ['id'],
          },
          where: {
            user_id: userId,
          },
          include: [{
            model: Keyword,
            attributes: {
              exclude: ['id', 'note_id'],
            },
          }]
        }
      ]
    })
      .then(notes => {
        res.status(200).json(notes);
      })
      .catch(err => next(err));
  } else {
    Note.findAll({
      include: [{
        model: Keyword,
        attributes: {
          exclude: ['id', 'note_id'],
        },
      }, {
        model: Note_Date,
        order: [['edit_date', 'DESC']],
        limit: 1,
        attributes: {
          exclude: ['id'],
        },
      }],
      where: {
        user_id: userId,
      },
    })
      .then(notes => {
        res.status(200).json(notes);
      })
      .catch(err => next(err));
  }
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

  let noteId = req.params.id;

  // Escape ' characterse since that is how postgres holds strings
  const text = req.body.text.replace("'", "''");
  const userId = req.user.id;
  const selectedKeywords = req.body.keywords;

  insertNoteOrCreateNote({ sequelize, noteId, userId, text })
    .then(([[anonymousNewNoteObj], success]) => {

      // Use the new note id 
      // if no noteId has been passed into req params
      if (typeof anonymousNewNoteObj !== "undefined") {
        noteId = anonymousNewNoteObj.id;
      }

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