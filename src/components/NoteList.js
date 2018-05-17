// React & Redux
import React from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// Redux Map To Props
import { mapNoteListStateToProps, mapNoteListDispatchToProps } from '../actions/noteListActions';

// Custom Components
import Note from './Note';
import Loader from './Loader';
import DateFilter from './DateFilter';

// Helpers
import { getMinMaxWeek } from '../helpers';

// Material UI
import { Tabs, Tab } from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';

// CSS
import '../css/NoteList.css';

class NoteList extends React.Component {


  constructor(props) {
    super(props);

    this.state = {
      searchTerm: '',
      minDate: '',
      maxDate: '',
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.keywordMatch = this.keywordMatch.bind(this);
    this.textMatch = this.textMatch.bind(this);
  }

  componentDidMount() {
    switch (this.props.sortBy) {
      case 'notes': {
        this.props.viewAllNotes();
        break;
      }
      case 'dates': {
        this.props.viewNotesByDates();
        break;
      }
      default: {
        this.props.viewAllNotes();
        break;
      }
    }
  }

  viewNote(note) {
    this.props.closeList();
    this.props.setNote(note);
  }

  deleteNote(id, sortBy) {
    this.props.deleteNote(id, sortBy);
  }

  keywordMatch({ keyword }) {
    const keywordRegex = new RegExp(`.*${this.state.searchTerm}.*`, 'i');
    return keyword.match(keywordRegex);
  }

  textMatch(text) {
    const textRegex = new RegExp(`.*${this.state.searchTerm}.*`, 'i');
    return text.match(textRegex);
  }

  generateNoteList() {
    switch (this.props.sortBy) {
      case 'notes': {

        // filter on search term and then map information to Note component
        return (
          <ReactCSSTransitionGroup
            transitionName='note'
            transitionEnterTimeout={500}
            transitionApplyTimeout={500}
            transitionLeaveTimeout={500}
          >
            {this.props.notes.filter(note => {
              if (this.state.searchTerm.trim() === '') {
                return note;
              }

              // If keyword or text of note match the search term
              if (note.Keywords.some(this.keywordMatch) || this.textMatch(note.text)) {
                return note;
              }
            }).map(({ id, Keywords: keywords, Note_Dates: [{ edit_date: date }], text }, index) => {
              return (
                <Note
                  noteId={id}
                  keywords={keywords.length > 0 ? keywords.map(keywordObj => keywordObj.keyword).reduce((acc, cv) => acc + ', ' + cv) : []}
                  date={date}
                  text={text}
                  viewNote={() => this.viewNote({
                    id,
                    Keywords: [...keywords],
                    Note_Dates: [{ edit_date: date }],
                    text
                  })}
                  deleteNote={() => this.deleteNote(id, this.props.sortBy)}
                  key={id.toString()}
                />
              )
            })}
          </ReactCSSTransitionGroup>
        );

        break;
      }
      case 'date': {
        return (
          <ReactCSSTransitionGroup
            transitionName='note'
            transitionEnterTimeout={500}
            transitionApplyTimeout={500}
            transitionLeaveTimeout={500}
          >
            {this.props.notes.filter(note => {
              if (this.state.minDate === '' || this.state.maxDate === '') {
                return note;
              }

              // Needed to convert postgresql timestamp to a javascript timestamp
              const editDate = new Date(note.edit_date.replace(' ', 'T')).getTime();
              const minDate = new Date(this.state.minDate).getTime();
              const maxDate = new Date(this.state.maxDate).getTime();

              if (minDate <= editDate && editDate <= maxDate) {
                return note;
              }
            }).map(({ note_id, id, edit_date: date, Note: { Keywords: keywords, text } }) => {
              return (<Note
                noteId={note_id}
                keywords={keywords.length > 0 ? keywords.map(keywordObj => keywordObj.keyword).reduce((acc, cv) => acc + ', ' + cv) : []}
                date={date}
                text={text}
                viewNote={() => this.viewNote({
                  id: note_id,
                  ...this.props.notes.find(note => note.note_id === note_id).Note,
                })}
                deleteNote={() => this.deleteNote(note_id, this.props.sortBy)}
                key={id}
              />);
            })}
          </ReactCSSTransitionGroup>
        );
        break;
      }
      case 'week': {

        // Filter by search term then output with map
        return (
          <ReactCSSTransitionGroup
            transitionName='note'
            transitionEnterTimeout={500}
            transitionApplyTimeout={500}
            transitionLeaveTimeout={500}
          >
            {this.props.notes.filter(keywordObj => {
              if (this.state.searchTerm.trim() === '') {
                return keywordObj;
              }

              // If keyword or text of note match the search term
              if (this.textMatch(keywordObj.keyword)) {
                return keywordObj;
              }
            })
              .map(({ keyword, notes, week }, i, keywordArray) => {
                return (
                  <div>

                    {/* If there should be a week header */}
                    {((i === 0 || (i > 0 && this.props.notes[i].week !== this.props.notes[i - 1].week))
                      ? <h2 style={{
                        textAlign: 'center'
                      }}>{getMinMaxWeek(week)}</h2>
                      : null)}

                    <h3 style={{
                      textAlign: 'center',
                      textTransform: 'capitalize',
                    }}>{keyword}</h3>

                    {notes.map(({ id, Keywords: keywords, Note_Dates: [{ edit_date: date }], text }) => {
                      return (<Note
                        noteId={id}
                        keywords={keywords.length > 0 ? keywords.map(keywordObj => keywordObj.keyword).reduce((acc, cv) => acc + ', ' + cv) : []}
                        date={date}
                        text={text}
                        viewNote={() => this.viewNote({
                          id,
                          Keywords: [...keywords],
                          Note_Dates: [{ edit_date: date }],
                          text
                        })}
                        deleteNote={() => this.deleteNote(id, this.props.sortBy)}
                        key={`${id}-${i}`}
                      />);
                    })}

                  </div>
                );
              })}
          </ReactCSSTransitionGroup>
        );

        break;
      }
    }
  }

  handleChangeMinDate(event, date) {
    this.setState({
      minDate: date,
    });
  }

  handleChangeMaxDate(event, date) {
    this.setState({
      maxDate: date,
    });
  }

  handleSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  render() {
    return (
      <div style={{ backgroundColor: '#FDFDFD', }} className='window'>
        <h1 style={{ textAlign: 'center', }}>Note List</h1>

        {/* Search Bar */}
        <div
          style={{ textAlgin: 'center' }}
        >
          {this.props.sortBy === 'date'
            ? <DateFilter
              handleChangeMinDate={this.handleChangeMinDate}
              handleChangeMaxDate={this.handleChangeMaxDate}
            />
            : <TextField
              floatingLabelText='Search...'
              style={{
                textAlign: 'center',
                width: '90%',
                margin: '0 auto',
                margin: '1rem',
              }}
              type='text'
              value={this.state.searchTerm}
              onChange={this.handleSearchChange}
              hintText='Search...'
            />}
        </div>

        {/* Search Options */}
        <Tabs>
          <Tab onActive={() => this.props.viewAllNotes()} label='Note' >
          </Tab>
          <Tab onActive={() => this.props.viewNotesByDates()} label='Edit Dates' >
          </Tab>
          <Tab onActive={() => this.props.viewNotesByWeek()} label='Week' >
          </Tab>
        </Tabs>

        {this.generateNoteList()}

        <Loader
          visible={this.props.saving || this.props.loading}
        />

      </div>
    );
  }
};

export default connect(mapNoteListStateToProps, mapNoteListDispatchToProps)(NoteList);