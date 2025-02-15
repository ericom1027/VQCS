const initialState = {
  voteNotificationCount: 0,
};

const voteReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_VOTE_NOTIFICATION_COUNT":
      return {
        ...state,
        voteNotificationCount: action.payload,
      };
    case "CLEAR_VOTE_NOTIFICATION_COUNT":
      return {
        ...state,
        voteNotificationCount: 0,
      };
    case "CLEAR_NOTIFICATION_LIST":
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification.voterId !== action.payload
        ),
      };

    default:
      return state;
  }
};

export default voteReducer;
