import {
  UPDATE_NOTIFICATION_COUNT,
  SELECTED_PRODUCT,
} from "../../action-types";

export const updateNotificationCount = (count) => {
  return {
    type: UPDATE_NOTIFICATION_COUNT,
    payload: count,
  };
};

export const selectedHeaderProduct = (product) => {
  return {
    type: SELECTED_PRODUCT,
    payload: product,
  };
};
