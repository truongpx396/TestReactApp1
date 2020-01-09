import * as ActionTypes from "./ActionTypes";

export const phones = (
  state = { isLoading: true, errMess: null, phones: [] },
  action
) => {
  switch (action.type) {
    case ActionTypes.ADD_PHONES:
      return {
        ...state,
        isLoading: false,
        errMess: null,
        phones: action.payload
      };
    case ActionTypes.PHONES_LOADING:
      return { ...state, isLoading: true, errMess: null, phones: [] };
    case ActionTypes.PHONES_FAILED:
      return {
        ...state,
        isLoading: false,
        errMess: action.payload,
        phones: []
      };
    default:
      return state;
  }
};
