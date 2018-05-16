import { combineReducers } from 'redux';

import noteList from './noteListReducer';
import user from './userReducer';
import editor from './editorReducer';

// Notes should be changed to 'notes' to hold all the
// curent users notes... the information in the list of notes.
export default combineReducers({
  noteList,
  user,
  editor,
});