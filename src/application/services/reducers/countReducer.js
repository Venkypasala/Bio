import {
  UPDATE_NOTIFICATION_COUNT,
  SELECTED_PRODUCT,
} from "../../action-types";

const initialState = {
  enquireListData: [],
  selectedHeaderProduct: null,
};

const countReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_NOTIFICATION_COUNT:
      return {
        ...state,
        enquireListData: action.payload,
      };
    case SELECTED_PRODUCT:
      return {
        ...state,
        selectedHeaderProduct: action.payload,
      };
    default:
      return state;
  }
};

export default countReducer;
