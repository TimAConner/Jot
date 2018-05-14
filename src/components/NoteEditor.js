import React from 'react';
import { connect } from "react-redux";

import { mapEditorStateToProps, mapEditoreDispatchToProps } from '../actions/editorActions';

import '../css/NoteEditor.css';

import Loader from './Loader';

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

  componentDidMount() {
    this.setKeywords();

    const simulateDoubleClick = (x, y) => {
      const clickEvent = document.createEvent('MouseEvents');
      clickEvent.initMouseEvent(
        'dblclick', true, true, window, 0,
        0, 0, x, y, false, false,
        false, false, 0, null
      );
      document.elementFromPoint(x, y).dispatchEvent(clickEvent);
    }

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
      this.visualBox.current.style.zIndex = 1;
      this.inputBox.current.style.zIndex = -1;
      simulateDoubleClick(event.clientX, event.clientY);
      this.visualBox.current.style.zIndex = -1;
      this.inputBox.current.style.zIndex = 1;
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
    this.inputBox.current.innerText = '';
    this.visualBox.current.innerText = '';
    this.props.newNote();
  }

  render() {
    if (this.props.focusOnNote) {
      this.inputBox.current.focus();
      this.inputBox.current.scrollIntoView();
    }

    return (
      <div className='note-editor'>
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
          contentEditable='true'>{this.props.editor.text}
        </div>
        <button onClick={() => { this.newNote() }}>New Note</button>
        {this.props.saving ? <Loader
          text='Saving'
        /> : null}
      </div>
    );
  }
}

export default connect(mapEditorStateToProps, mapEditoreDispatchToProps)(NoteEditor);