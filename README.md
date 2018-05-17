# Jot


Jot is a streamlined note taking app for the scatterbrained, frequent note taker built as my Back End Capstone for [Nashville Software School](http://nashvillesoftwareschool.com/).  

1. About
1. Auto Organization
1. Technologies Used
1. How to Contribute
1. Api Endpoints
    1. Users
        1. POST /login
        1. POST /register
        1. ~~POST /logout~~
    1. Notes
        1. GET /notes
        1. GET /notes/:id
        1. DELETE /notes/:id
        1. PUT /notes/:id
## 1.  About
The application is designed to remove the obstacles in modern note taking and organizes your notes to help you find related notes.  The user is not required to add a title, date, or tag to the note.  Simply start typing and Jot (using IBM Watson) will highlight words it thinks are important.  Don't like them? No sweet.  Double tap / click a word and it will override Watson's keywords.  You may add as many as you want.

___

## 2. Auto Organization 
Jot automatically organizes your note in three seperate ways.  The first, by note, is your traditional organization method.  The other two, by everey edit date, and by week, are more in depth to help you find related notes.

1. Sort by Edit Date: Every time you edit a note, Jot remmembers when you edited it.  You may sort notes by these edit dates, allowing you to see other notes created around the same time, which may be related.

<img src="https://i.imgur.com/tzgudmx.png" alt="Sort by Edit Date Screen" style="width: 30%;"/>
<img src="https://i.imgur.com/kIJVJPS.png" alt="Sort by Edit Date Screen Search Example" style="width: 30%;"/>

1. Sort by Week: You may sort by week and see a list of keywords in that week with all notes pertaining to those keywords grouped together beneath them.

<img src="https://i.imgur.com/c9YKVY8.png" alt="Sort by Week Screen" style="width: 30%;"/>
<img src="https://i.imgur.com/M1SHaJr.png" alt="Sort by Week Screen with other week" style="width: 30%;"/>
<img src="https://i.imgur.com/saLp5tP.png" alt="Sort by Week Screen with other keyword" style="width: 30%;"/>

1. Sort by Note: You may sort by note to see notes sorted by their last edit date which is the traditional way to look at your notes.

<img src="https://i.imgur.com/nJ0CSGc.png" alt="Sort by Note Screen" style="width: 30%;"/>
<img src="https://i.imgur.com/2Uts5qp.png" alt="Note Sort Screen" style="width: 30%;"/>

___

## 3. Sleek Design
When you load Jot after logging in, Jot defaults to the note taking page with your cursor already in the textbox to allow you to start typing without any hinderance.  If you have logged in previously, it automatically will remember you giving you the quickest route to jotting down a thought.

<img src="https://i.imgur.com/OLjI5um.png" alt="Note Taking Screen" style="width: 30%;"/>
<img src="https://i.imgur.com/TtIDbtm.png" alt="Note Taking Screen" style="width: 30%;"/>

___

## 4. Easy on The Eyes
Jot is designed with an easy-going user interface and a desire to clutter the user's life as little as possible.  With each user's visual needs varying slightly, on top of the default simple styling, the user can change the font style and size, and how Jot highlights keywords.

<img src="https://i.imgur.com/UI8t3CP.png" alt="Option Screen" style="width: 30%;"/>
<img src="https://i.imgur.com/VRmsF7b.png" alt="Option Screen with Droopdown" style="width: 30%;"/>

___

## 5. Technologies Used
1. React / Redux
1. Material UI
1. Sequelize
1. PostgreSQL
1. Axios
1. Watson Natural Language Understanding
1. Passport (with JSON Web Tokens)
1. Bcrypt

___

## 6. How to Contribute
1. Fork the project to your GitHub
1. Clone the project
1. Create `server/config/watsonConfig.js`
1.  Provide your own credentials in it in the below pattern

```
module.exports = {
  "username": "[your username]",
  "password": "[your password]",
  "version": '[your version]',
  "url": 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
};
```

1. Create a new PostgreSQL database.
1. Create the file  `/sequelize/config/config.json`. 
1. In that file, provide the credentials to the PostgreSQL database you made.

```
{
  "development": {
    "username": "Tim",
    "password": "postgres",
    "database": "jot",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "username": "Tim",
    "password": "postgres",
    "database": "jot",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "username": "Tim",
    "password": "postgres",
    "database": "jot",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}
```

1. Run `npm run buildDb`
1. In another window, run `nodemon server/server.js` to start the node server.
1. In the same window, run `npm start` to start the react development server.
1. You're ready to start modifying the project!  Running npm start should open up a browser window.  If not, navigate to `http://localhost:3000/`.

___

## 7. API Endpoints
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
    1. PUT /notes/:id

### 1. Authorization
Endpoints denoted with '*' require you to be logged in require a JSON Web Token Authorization header with a body of `Bearer {your_token}`.
### 2. Users

#### POST /login
##### Example Request Body
If successful, returns the user information and a json web token that when attached to the header of other requests will allow the user to access the endpoints.  See the Authorization section.

```
{
  "email": [your email],
  "password": [your password]
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
Registers a new user, and if successful, returns the new user's information and web token to be used as their future authentication.
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
### 3. Notes
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
Creates or edits the note at the given id, escaping single quotes in the note; creates the keywords from the keyword array, or if no keyword array is sent, it uses IBM Watson to generate them; and finally adds a new date_edit entry if it has not been edited within the last 24 hours.
##### Example Request Body
```
{
  "text": "This is a note",
  "keywords": ['this', 'note']
}
```

Returns 200 if successful.
___