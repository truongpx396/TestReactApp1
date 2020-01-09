import * as ActionTypes from "./ActionTypes";

export const fetchPhones = () => dispatch => {
  dispatch(phonesLoading());
  return fetch(baseUrl)
    .then(
      response => {
        if (response.ok) return response;
        else {
          var error = new Error(
            "Error " + response.status + ": " + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      error => {
        var errMess = new Error(error.message);
        throw errMess;
      }
    )
    .then(response => response.json())
    .then(phones => dispatch(addPhones(phones)))
    .catch(error => dispatch(phonesFailed(error.message)));
};
export const phonesLoading = () => ({
  type: ActionTypes.PHONES_LOADING
});

export const addPhones = phones => ({
  type: ActionTypes.ADD_PHONES,
  payload: phones
});

export const phonesFailed = errmess => ({
  type: ActionTypes.PHONES_FAILED,
  payload: errmess
});

export const postFavorite = id => dispatch => {
  setTimeout(() => {
    dispatch(addFavorite(id));
  }, 500);
};

export const addFavorite = id => ({
  type: ActionTypes.ADD_FAVORITE,
  payload: id
});

export const deleteFavorite = id => ({
  type: ActionTypes.DELETE_FAVORITE,
  payload: id
});

export const conversationsLoading = () => ({
  type: ActionTypes.CONVERSATIONS_LOADING
});

export const addConversations = conversations => ({
  type: ActionTypes.ADD_CONVERSATIONS,
  payload: conversations
});

export const conversationsFailed = errmess => ({
  type: ActionTypes.CONVERSATIONS_FAILED,
  payload: errmess
});
