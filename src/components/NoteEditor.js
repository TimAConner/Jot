// React & Redux
import React from 'react';
import { connect } from "react-redux";


// Redux Store
import { mapEditorStateToProps, mapEditoreDispatchToProps } from '../actions/editorActions';

// CSS
import '../css/NoteEditor.css';

// Custom Components
import Loader from './Loader';

// Material UI
import AddIcon from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';

// Must be ran afer importing it to initialize it
import injectTapEventPlugin from "react-tap-event-plugin"
import isDblTouchTap from '../properties/isDblTouchTap';
injectTapEventPlugin();

const editorInputStyling = {
  position: 'absolute',
  top: '3rem',
  width: '100%',
};

const addButtonStyling = {
  position: 'fixed',
  bottom: '1rem',
  right: '1rem',
};

class NoteEditor extends React.Component {


  constructor(props) {
    super(props);
    this.saveNote = this.saveNote.bind(this);
    this.setKeywords = this.setKeywords.bind(this);

    this.inputBox = React.createRef();
    this.visualBox = React.createRef();

    this.autoSelectedWords = [];
    this.userSelectedWords = [];

    this.nonKeywordClass = 'nonKeyword';

    this.updateHtml = () => {
      let totalText = this.inputBox.current.innerText;

      // Add span around other words
      const userOrWatson = () => {
        return this.userSelectedWords.length !== 0 ? this.userSelectedWords : this.autoSelectedWords;
      };

      const highlightClass = () => {
        return this.userSelectedWords.length === 0
          ? this.props.options.auto_keyword_style || 'italic'
          : this.props.options.user_keyword_style || 'bold';
      };


      // Replace keywords in note string
      for (let word of userOrWatson()) {
        const regex = new RegExp(`(?<![a-zA-Z])(${word}{1})(?![a-zA-Z])`, 'gi');

        // To fix issue #36 on github, you may implement a look ahead/behind to check if already in span.
        totalText = totalText.replace(regex, `<span class="${highlightClass()}">$1</span>`);
      }

      // If word does not exist in note, remove from keyword array.
      this.userSelectedWords = this.userSelectedWords.filter(word => {
        const regex = new RegExp(`(?<![a-zA-Z])(${word}{1})(?![a-zA-Z])`, 'gi');
        if (totalText.match(regex)) {
          return word;
        }
      });

      const stringRegex = new RegExp(`(<span class="${highlightClass()}">.*?<\/span>)`);
      let splitOnSpan = totalText.split(stringRegex);

      // Replace non-keywords with otherWord class
      splitOnSpan = splitOnSpan.map(string => {
        if (stringRegex.exec(string) === null) {
          const wordRegex = new RegExp(`\\b(\\w+)\\b`, 'gi');
          const wordWithSpan = string.replace(wordRegex, `<span class="${this.nonKeywordClass}">$1</span>`);
          return wordWithSpan;
        } else {
          return string;
        }
      });

      // Re put togethor note string
      splitOnSpan = splitOnSpan.reduce((acc, val) => acc + val);

      this.visualBox.current.innerHTML = splitOnSpan;
    };
  }

  // There are multiples in the keyworrds array so they get wrapped several times.
  // When you press save, keywords are being reset because of this.  The new keywords need to be sent back.
  setKeywords() {
    if (this.props.existingNoteLoaded) {
      this.userSelectedWords = [];
      this.autoSelectedWords = [];
      this.props.editor.Keywords.map(({ keyword, user_selected }) => {
        if (user_selected) {
          if (!this.userSelectedWords.includes(keyword)) {
            this.userSelectedWords.push(keyword);
          }
        } else {
          if (!this.autoSelectedWords.includes(keyword)) {
            this.autoSelectedWords.push(keyword);
          }
        }
      });
    }
  }

  simulateDoubleClick = (x, y) => {
    const clickEvent = document.createEvent('MouseEvents');
    clickEvent.initMouseEvent(
      'dblclick', true, true, window, 0,
      0, 0, x, y, false, false,
      false, false, 0, null
    );
    console.log(x, y);
    document.elementFromPoint(x, y).dispatchEvent(clickEvent);
  }

  simulateDoubleClickOnVisualBox = event => {
    this.visualBox.current.style.zIndex = 1;
    this.inputBox.current.style.zIndex = -1;
    this.simulateDoubleClick(event.clientX, event.clientY);
    this.visualBox.current.style.zIndex = -1;
    this.inputBox.current.style.zIndex = 1;
  };

  componentDidMount() {
    this.setKeywords();

    this.visualBox.current.addEventListener('dblclick', obj => {
      const targetWord = obj.target.innerText;
      // Toggle Click
      if (this.userSelectedWords.includes(targetWord)) {
        this.userSelectedWords = this.userSelectedWords.filter(string => string !== targetWord);
      } else {
        this.userSelectedWords.push(obj.target.innerText);
      }
      this.inputBox.current.focus();
      this.updateHtml();
    });

    this.inputBox.current.addEventListener('dblclick', event => {
      this.simulateDoubleClickOnVisualBox(event);
    });

    this.inputBox.current.addEventListener('click', event => {
      if (isDblTouchTap(event)) {
        this.simulateDoubleClickOnVisualBox(event);
      }
    });

    this.inputBox.current.addEventListener('keyup', () => {
      this.updateHtml();
    });

    // To force paste without formatting
    this.inputBox.current.addEventListener("paste", function (event) {
      event.preventDefault();
      let text = event.clipboardData.getData("text/plain");
      document.execCommand("insertHTML", false, text);
    });

    this.inputBox.current.focus();

    // Call once to set the overlay box
    this.updateHtml();
  }

  componentDidUpdate() {

    // this.autoKeywordClass = this.props.user.Options.auto_keyword_style;
    // this.userKeywordClass = this.props.user.Options.user_keyword_style;

    if (this.props.focusOnNote) {
      this.props.setFocusToFalse();
    }

    //  When words are being saved they are being wrapped in bold span again.
    this.setKeywords();
    this.updateHtml();
  }

  saveNote() {
    if (this.inputBox.current.innerText.trim() === '') {
      return;
    }
    if (this.inputBox.current.innerText.trim() === this.props.editor.text.trim()) {
      return;
    }

    this.props.saveNote(this.props.saving, this.props.editor.id, this.inputBox.current.innerText, this.userSelectedWords, this.props.reloadSortBy);
  }

  newNote() {

    //TODO: Add a snackbar for this.
    if (!this.props.saving) {
      this.inputBox.current.innerText = '';
      this.visualBox.current.innerText = '';
      this.props.newNote();
    }
  }

  showNoteList() {

  }

  render() {
    if (this.props.focusOnNote) {
      this.inputBox.current.focus();
      // this.inputBox.current.scrollIntoView();
    }

    return (
      <div style={editorInputStyling}>
        <div
          ref={this.visualBox}
          id='visualBox'
          className={`visualBox ${this.props.options.font_style} ${this.props.options.font_size}`}>
        </div>
        <div ref={this.inputBox} id='inputBox'
          type='text'
          onInput={() => this.saveNote()}
          onDoubleClick={() => this.saveNote()}
          onBlur={() => this.saveNote()}
          className={`inputBox ${this.props.options.font_style} ${this.props.options.font_size}`}
          contentEditable='true'
        >
          {this.props.editor.text}
        </div>

        <FloatingActionButton
          zDepth={1}
          backgroundColor={'#90CCF4'}
          mini={true}
          onClick={() => this.newNote()}
          style={addButtonStyling}
        >
          <AddIcon />
        </FloatingActionButton>

        {this.props.saving ? <Loader
          text='Saving'
        /> : null}
      </div>
    );
  }
}

export default connect(mapEditorStateToProps, mapEditoreDispatchToProps)(NoteEditor);