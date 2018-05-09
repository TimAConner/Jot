import React from 'react';
import { connect } from "react-redux";

import { mapEditorStateToProps, mapEditoreDispatchToProps } from '../actions/editorActions';

import '../css/NoteEditor.css';



class NoteEditor extends React.Component {


  constructor(props) {
    super(props);

    console.log(this.props);
    console.log(this.props.editor.text);

    // this.state = {
    //   text: this.props.editor.text,
    // };

    this.saveNote = this.saveNote.bind(this);

    // this.inputBox = this.refs.inputBox;
    // this.visualBox = this.refs.visualBox
    this.inputBox = React.createRef();
    this.visualBox = React.createRef();

    this.autoSelectedWords = [];
    this.userSelectedWords = [];

    this.otherWordClass = 'otherWord';
    this.automatedKeywordClass = 'italic';
    this.selectedKeywordClass = 'bold';

    this.updateHtml = () => {

      console.log('THIS INPUT BOX', this.inputBox);
      let totalText = this.inputBox.current.innerText;


      // Add span around other words
      const whichArray = () => {
        return this.userSelectedWords.length !== 0 ? this.userSelectedWords : this.autoSelectedWords;
      };

      const whichBoldOrItalic = () => {
        return this.userSelectedWords.length === 0 ? this.automatedKeywordClass : this.selectedKeywordClass;
      };


      // Replace keywords in note string
      for (let word of whichArray()) {
        const regex = new RegExp(`(?<![a-zA-Z])(${word}{1})(?![a-zA-Z])`, 'gi');
        totalText = totalText.replace(regex, `<span class="${whichBoldOrItalic()}">$1</span>`);
      }

      const stringRegex = new RegExp(`(<span class="${whichBoldOrItalic()}">.*?<\/span>)`);
      let splitOnSpan = totalText.split(stringRegex);

      // Check for spaces and default cursor to focused.

      // Replace non-keywords with otherWord class
      splitOnSpan = splitOnSpan.map(string => {
        if (stringRegex.exec(string) === null) {
          const wordRegex = new RegExp(`\\b(\\w+)\\b`, 'gi');
          const wordWithSpan = string.replace(wordRegex, `<span class="${this.otherWordClass}">$1</span>`);
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

  componentDidMount() {
    console.log("INPUT BOX", this.inputBox.current);

    this.props.editor.Keywords.map(({ keyword, user_selected }) => {
      if (user_selected) {
        this.userSelectedWords.push(keyword);
      }

      this.autoSelectedWords.push(keyword);
    });

    // Will need to be set to the users preferences.

    // Modify to deal with hard returns


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

  componentDidUpdate(){
    this.updateHtml();
  }

  saveNote(event) {
    // save keywords if generated through user
    // save text
    // when done, get new watson keywords
  }

  render() {
    
    return (
      <div className='note-editor'>
        <div ref={this.visualBox}  id="visualBox" className="visualBox"></div>
        <div ref={this.inputBox} id="inputBox"
          type="text"
          onInput={event => this.saveNote(event)}
          className="inputBox"
          contentEditable="true">{this.props.editor.text}</div>
      </div>
    );
  }
}

export default connect(mapEditorStateToProps, mapEditoreDispatchToProps)(NoteEditor);