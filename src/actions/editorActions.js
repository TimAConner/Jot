import axios from 'axios';

export function mapEditorStateToProps(state) {
  return {
    editor: state.editor,
  }
}

export function mapEditoreDispatchToProps(dispatch) {
  return {
    saveEditor: (note) => {
      dispatch({ type: "set_editor_text", payload: note });
    },
  }
};