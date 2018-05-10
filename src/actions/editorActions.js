import axios from 'axios';
import { backendUrl, putPostHeaders } from '../helpers';

export function mapEditorStateToProps(state) {
  return {
    editor: state.editor,
    noteLoaded: state.editor.noteLoaded,
    saving: state.editor.saving,
  }
}

export function mapEditoreDispatchToProps(dispatch) {
  return {
    saveNote: (id, text, keywords) => {
      dispatch({ type: 'save_note_pending' });

      // text = JSON.stringify(text);

      console.log(text);

      const requestObject = {
        text,
      };

      // Only add in a keywords field if there are keywords
      if (keywords.length > 0) {
        requestObject.keywords = keywords;
      }

      axios.put(`${backendUrl}/notes/${id}`, JSON.stringify(requestObject), putPostHeaders)
        .then(response => {
          dispatch({ type: 'save_note_fulfilled', payload: response.data });

          dispatch({ type: 'view_notes_pending' });
          axios.get('http://localhost:8080/notes/')
            .then(response => {
              dispatch({ type: 'view_notes_fulfilled', payload: response.data });
            })
            .catch((response) => {
              dispatch({ type: 'view_notes_failed', payload: response });
            })

        })
        .catch((response) => {
          dispatch({ type: 'save_note_failed', payload: response });
        });
    },
  }
};