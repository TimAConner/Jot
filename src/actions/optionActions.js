import axios from 'axios';
import { backendUrl, putPostHeaders } from '../helpers';

export function mapOptionStateToProps(state) {
  return {
    user: state.user.user,
  }
}

export function mapOptionDispatchToProps(dispatch) {
  return {
    updateOption: ({value, key}) => {
      dispatch({ type: 'set_user_options_pending' });
      axios.patch(`${backendUrl}/currentUser`, JSON.stringify({
        [key]: value,
      }), putPostHeaders)
        .then(response => {
          dispatch({ type: 'set_user_options_fulfilled', payload: response.data });
        })
        .catch(response => {
          dispatch({ type: 'set_user_options_failed', payload: response });
        });
    },
  }
};