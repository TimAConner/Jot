export default function reducer(state = {
  user: null,
  isLoading: false,
  error: null,
  options: {
    font_size: 8,
    font_style: 'sans-serif',
    auto_keyword_style: 'italic',
    user_keyword_style: 'bold',
  },
}, action) {
  switch (action.type) {
    case 'login_user_pending': {
      return {
        ...state,
      };
    }
    case 'login_user_failed': {
      console.log("Error", action.payload);
      return {
        ...state,
        error: action.payload,
      };
    }
    case 'login_user_fulfilled': {
      return {
        ...state,
        user: {
          ...action.payload,
        }
      }
    }
    case 'getting_user_pending': {
      return {
        ...state,
        isLoading: true,
      };
    }
    case 'getting_user_failed': {
      console.log("Error", action.payload);

      return {
        ...state,
        user: null,
        isLoading: false,
      };
    }
    case 'getting_user_fulfilled': {
      console.log('getting user fulfilled', action.payload);
      return {
        ...state,
        user: {
          ...action.payload,
        },
        options: {
          ...action.payload.Option
        },
        isLoading: false,
      }
    }
    case 'set_user_options_pending': {
      return {
        ...state,
      };
    }
    case 'set_user_options_failed': {
      return {
        ...state,
      };
    }
    case 'set_user_options_fulfilled': {
      return {
        ...state,
        options: { ...action.payload.Option },
        user: {
          ...state.user,
          Option: { ...action.payload.Option },
        },
      };
    }
    default: {
      return state;
    }
  }
}