# Jot
Jot is my back-end capstone built while at [Nashville Software School](http://nashvillesoftwareschool.com/)

## Jot

## API Endpoints
This api is consumed via the Jot front end and is only meant to be used with Jot.

1. Authorization
1. Users
    1. POST /login
    1. POST /register
    1. ~~POST /logout~~
1. Notes
    1. GET /notes
    1. GET /notes/:id
    1. DELETE /notes/:id
    1. PUT /notes/:id.  

### Authorization
Endpoints denoted with '*' require you to be logged in require a JSON Web Token Authorization header with a body of `Bearer {your_token}`.
### Users

#### POST /login
##### Example Request Body
If successful, returns the user information and a json web token that when attached to the header of other requests will allow the user to access the endpoints.  See the Authorization seciotno.

```
{
  "email": [your_email],
  "password": [your_password]
}
```
##### Example return if successful
```
{
    "user": {
        "id": 1,
        "display_name": "Tim",
        "password": "$2a$08$PUYDqcuQWeFO771NSuJHkOmzpjXrvzRW6XaOK9WvFtT9MNxOqmvNi",
        "email": "a@a.com",
        "creation_date": "1970-01-18T15:38:40.916Z",
        "Option": {
            "id": 1,
            "font_size": "small",
            "font_style": "sans-serif",
            "auto_keyword_style": "bold",
            "user_keyword_style": "italic",
            "user_id": 1
        }
    },
    "token": [your json web token]
}
```
#### POST /register
Registers a new user, and if succesful, returns the new user's information and web token to be used as their future authentication.
###### Example Request Body
```
{
	"email": "a@dd.com",
	"password": "password123",
	"display_name": "Joe",
	"confirm": "password123"
}
```
##### Example Return Body
```
{
    "user": {
        "id": 3,
        "display_name": "Joe",
        "email": "a@dd.com",
        "creation_date": "2018-05-17T19:25:15.635Z",
        "Option": {
            "id": 3,
            "font_size": "small",
            "font_style": "sans-serif",
            "auto_keyword_style": "italic",
            "user_keyword_style": "bold",
            "user_id": 3
        }
    },
    "token": [your json web token]
}
```
#### POST /logout
Depricated.

#### * GET /currentUser
Returns the user's basic information and their options.
##### Example return if successful
```
{
    "id": 1,
    "display_name": "Tim",
    "email": "a@a.com",
    "creation_date": "1970-01-18T15:38:40.916Z",
    "Option": {
        "font_size": "small",
        "font_style": "sans-serif",
        "auto_keyword_style": "italic",
        "user_keyword_style": "bold"
    }
}
```
#### * PATCH /currentUser
Updates the user's settings.  One or all four options may be sent in a patch.
##### Example Request Body
```
{
    "font_size": "small",
    "font_style": "sans-serif",
    "auto_keyword_style": "italic",
    "user_keyword_style": "bold"
}
```

##### Example return if successful
```
{
    "id": 1,
    "display_name": "Tim",
    "email": "a@a.com",
    "creation_date": "1970-01-18T15:38:40.916Z",
    "Option": {
       [ "font_size": "small",
        "font_style": "sans-serif",
        "auto_keyword_style": "bold",
        "user_keyword_style": "italic"]
    }
}
```
___
### Notes
#### * GET /notes/
Returns all given user's notes with all keywords and each note's most recent edit date.

To group by keywords by week add `?weekView=true`  
To sort by all edit dates add `?dateView=true`
##### Example return if successful
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
#### * GET /notes/:id 
Returns given note with all keywords and its most recent edit date.
##### Example return if successful
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
#### * DELETE /notes/:id
Deletes the specified note.  Returns the number of rows deleted.  If none were deleted, 0 is returned.
##### Example return if successful
```
1
```

#### * PUT /notes/:id
Creates or edits the note at the given id, escaping single quotes in the note; creates the keywords from the keyword array, or if no keyword array is sent, it uses watson to generate them; and finally adds a new date_edit entry if it has not been edited within the last 24 hours.
##### Example Request Body
```
{
  "text": "This is a note",
  "keywords": ['this', 'note']
}
```

Returns 200 if succesful.
___