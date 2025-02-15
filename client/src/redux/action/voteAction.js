export const setVoteNotificationCount = (count) => {
  return {
    type: "SET_VOTE_NOTIFICATION_COUNT",
    payload: count,
  };
};

export const clearVoteNotificationCount = () => {
  return {
    type: "CLEAR_VOTE_NOTIFICATION_COUNT",
  };
};

export const clearNotificationsList = (voterId) => {
  return {
    type: "CLEAR_NOTIFICATIONS_LIST",
    payload: voterId,
  };
};
