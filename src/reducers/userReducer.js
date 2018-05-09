export default function reducer(state = {
  user: null,
  isLoading: false,
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
      };
    }
    case 'login_user_fulfilled': {
      return {
        ...state,
        user: {
          ...action.payload
        },
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
        isLoading: false,
      };
    }
    case 'getting_user_fulfilled': {
      console.log('getting user fulfilled', action.payload);
      return {
        ...state,
        user: {
          ...action.payload
        },
        isLoading: false,
      }
    }
    default: {
      return state;
    }
  }
}