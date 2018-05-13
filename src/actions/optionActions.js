import axios from 'axios';
import { backendUrl, putPostHeaders } from '../helpers';

export function mapOptionStateToProps(state) {
  return {
    email: state.user.email,
    displayName: state.user.displayName,
    autoKeywordStyle: state.user.Option.auto_keyword_style,
    userKeyworStyle: state.user.Option.user_keyword_style,
    fontSize:state.user.Option.font_size,
    fontStyle: state.user.Option.font_style,
  }
}

export function mapOptionDispatchToProps(dispatch) {
  return {
    // authenticate: () => {

    //   if (!localStorage.getItem('jotToken')) {
    //     return dispatch({ type: 'getting_user_failed' });
    //   }

    //   // Set axios authorization to the current token
    //   axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('jotToken')}`;

    //   dispatch({ type: 'getting_user_pending' });
    //   axios.get(`${backendUrl}/currentUser`)
    //     .then(response => {
    //       dispatch({ type: 'getting_user_fulfilled', payload: response.data });
    //     })
    //     .catch(response => {
    //       console.log(response);
    //       dispatch({ type: 'getting_user_failed', payload: response });
    //     });
    // },
  }
};