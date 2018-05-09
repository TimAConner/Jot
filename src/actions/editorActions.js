import axios from 'axios';

export function mapEditorStateToProps(state) {
  return {
    editor: state.editor,
  }
}

export function mapEditoreDispatchToProps(dispatch) {
  return {
    saveNote: note => {
      dispatch({ type: "save_note_pending"});
      // post note to server.
    },
  }
};