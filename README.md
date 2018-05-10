# Jot
Jot is my back-end capstone built while at [Nashville Software School](http://nashvillesoftwareschool.com/)

## API Endpoints
These endpoints are here for developer access and not open to the public.  To access most of these endpoints, you must be logged into the application.
### /notes
#### GET /notes/
Returns all given user's notes with all keywords and each note's most recent edit date.

To group by keywords by week add `?weekView=true`
To sort by all edit dates add `?dates=true`
```
[
  {
    "id": 1,
    "text": "This is an example note.",
    "user_id": 1,
    "Keywords": [
      {
        "id": 1,
        "keyword": "example",
        "user_selected": true,
        "note_id": 1
      },
      {
        "id": 2,
        "keyword": "note",
        "user_selected": true,
        "note_id": 1
      }
    ],
    "Note_Dates": [
      {
        "id": 1,
        "edit_date": "2018-04-30T21:27:14.209Z",
        "note_id": 1
      }
    ]
  }
]
```
#### GET /notes/:id 
Returns given note with all keywords and its most recent edit date.
```
[
  {
    "id": 1,
    "text": "This is an example note.",
    "user_id": 1,
    "Keywords": [
      {
        "id": 1,
        "keyword": "example",
        "user_selected": true,
        "note_id": 1
      },
      {
        "id": 2,
        "keyword": "note",
        "user_selected": true,
        "note_id": 1
      }
    ],
    "Note_Dates": [
      {
        "id": 1,
        "edit_date": "2018-04-30T21:27:14.209Z",
        "note_id": 1
      }
    ]
  }
]
```
#### DELETE /notes/:id
Deletes the specified note.  Returns the number of rows deleted.  If none were deleted, 0 is returned.
```
1
```

#### PUT /notes/:id
Creates or edits the note at the given id, escaping single quotes in the note; creates the keywords from the keyword array, or if no keyword array is sent, it uses watson to generate them; and finally adds a new date_edit entry if it has not been edited within the last 24 hours.
##### Example Request Body:
```
{
  "text": "This is a note",
  "keywords": ['this', 'note']
}
```

Returns 200 if succesful.
___