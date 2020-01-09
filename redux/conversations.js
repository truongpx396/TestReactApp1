import * as ActionTypes from "./ActionTypes";

export const conversations = (
  state = { isLoading: true, errMess: null, data: [] },
  action
) => {
  switch (action.type) {
    case ActionTypes.ADD_CONVERSATIONS:
      return {
        ...state,
        isLoading: false,
        errMess: null,
        data: action.payload
      };
    case ActionTypes.CONVERSATIONS_LOADING:
      return { ...state, isLoading: true, errMess: null, data: [] };
    case ActionTypes.CONVERSATIONS_FAILED:
      return {
        ...state,
        isLoading: false,
        errMess: action.payload,
        data: []
      };
    default:
      return state;
  }
};
