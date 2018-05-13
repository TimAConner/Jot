export default function reducer(state = {}, action) {
  switch (action.type) {
    case 'set_user_options_pending': {
      return {
        ...state,
      };
    }
    default: {
      return state;
    }
  }
}