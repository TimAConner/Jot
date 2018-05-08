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


  }

  componentDidMount() {
    'use strict';
    const inputBox = document.querySelector('#inputBox');
    const visualBox = document.querySelector('#visualBox');

    let autoSelectedWords = [];
    let userSelectedWords = [];

    this.props.editor.Keywords.map(({keyword, user_selected}) => {
      if(user_selected){
        userSelectedWords.push(keyword);
      }

      autoSelectedWords.push(keyword);
    });

    // Will need to be set to the users preferences.
    const otherWordClass = 'otherWord';
    const automatedKeywordClass = 'italic';
    const selectedKeywordClass = 'bold';

    // Modify to deal with hard returns
    const updateHtml = () => {

      let totalText = inputBox.innerText;


      // Add span around other words
      const whichArray = () => {
        return userSelectedWords.length !== 0 ? userSelectedWords : autoSelectedWords;
      };

      const whichBoldOrItalic = () => {
        return userSelectedWords.length === 0 ? automatedKeywordClass : selectedKeywordClass;
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
          const wordWithSpan = string.replace(wordRegex, `<span class="${otherWordClass}">$1</span>`);
          return wordWithSpan;
        } else {
          return string;
        }
      });

      // Re put togethor note string
      splitOnSpan = splitOnSpan.reduce((acc, val) => acc + val);

      visualBox.innerHTML = splitOnSpan;
    };

    const simulateDoubleClick = (x, y) => {
      const clickEvent = document.createEvent('MouseEvents');
      clickEvent.initMouseEvent(
        'dblclick', true, true, window, 0,
        0, 0, x, y, false, false,
        false, false, 0, null
      );
      document.elementFromPoint(x, y).dispatchEvent(clickEvent);
    }

    visualBox.addEventListener('dblclick', obj => {
      const targetWord = obj.target.innerText;
      // Toggle Click
      if (userSelectedWords.includes(targetWord)) {
        userSelectedWords = userSelectedWords.filter(string => string !== targetWord);
      } else {
        userSelectedWords.push(obj.target.innerText);
      }
      inputBox.focus();
      updateHtml();
    });

    inputBox.addEventListener('dblclick', event => {
      visualBox.style.zIndex = 1;
      inputBox.style.zIndex = -1;
      simulateDoubleClick(event.clientX, event.clientY);
      visualBox.style.zIndex = -1;
      inputBox.style.zIndex = 1;
    });

    inputBox.addEventListener('keyup', () => {
      updateHtml();
    });

    // To force paste without formatting
    inputBox.addEventListener("paste", function (event) {
      event.preventDefault();
      let text = event.clipboardData.getData("text/plain");
      document.execCommand("insertHTML", false, text);
    });

    inputBox.focus();

    // Call once to set the overlay box
    updateHtml();
  }

  render() {
    return (
      <div className='note-editor'>
        <div id="visualBox" className="visualBox"></div>
        <div id="inputBox"
          type="text"
          // onChange={() => this.props.saveEditor(this.props.text)}
          className="inputBox"
          contentEditable="true">{this.props.editor.text}</div>
      </div>
    );
  }
}

export default connect(mapEditorStateToProps, mapEditoreDispatchToProps)(NoteEditor);