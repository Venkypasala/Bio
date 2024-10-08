import {
  LOGIN,
  FAIL,
  SUCCESS,
  LOGOUT,
  GET_PRODUCT_LIST,
  GET_CERTIFICATE_LIST,
  GET_PRODUCT_BY_CATEGORY,
  DELETE_PRODUCT_LIST,
  GET_PRODUCT_BY_ID,
  IMAGE_UPLOAD,
  GET_LATEST_PRODUCT,
  GET_CATEGORY_LIST,
  ADD_CATEGORY,
  ADD_TO_LATEST,
  GET_LAST_PRODUCT,
  IS_VISIBLE_CATEGORY,
  IS_VISIBLE_PRODUCT,
  REFRESH_TOKEN,
  GET_PRODUCT_BY_PRODUCT,
} from "../../action-types";

const initialState = {
  isUserValid: false,
  isAuthenticating: false,
  error: {},
  loginUserInformation: {},
  refreshTokenInformation: {},
  getProductList: {},
  getCertificateList: {},
  getProductByCategory: {},
  deleteProduct: {},
  getProductById: {},
  imgUpload: {},
  getLatestProduct: {},
  getCategoryList: {},
  addToLatest: {},
  getLastProduct: {},
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case LOGIN:
      return { ...state, isAuthenticating: true };
    case `${LOGIN}_${SUCCESS}`:
      return {
        ...state,
        isUserValid: true,
        loginUserInformation: { ...payload },
      };
    case `${LOGIN}_${FAIL}`:
      return {
        ...state,
        isAuthenticating: false,
        isUserValid: false,
        error: { ...payload },
      };

    case `${LOGOUT}_${SUCCESS}`:
      return { ...state, isUserValid: false };
    case GET_PRODUCT_LIST:
      return { ...state, isAuthenticating: true };

    case `${REFRESH_TOKEN}_${SUCCESS}`:
      return {
        ...state,
        isUserValid: true,
        refreshTokenInformation: { ...payload },
      };

    case GET_PRODUCT_LIST:
      return { ...state, isAuthenticating: true };
    case `${GET_PRODUCT_LIST}_${SUCCESS}`:
      return {
        ...state,
        isUserValid: true,
        getProductList: { ...payload },
      };
    case `${GET_PRODUCT_LIST}_${FAIL}`:
      return {
        ...state,
        isAuthenticating: false,
        isUserValid: false,
        error: { ...payload },
      };

    case GET_CERTIFICATE_LIST:
      return { ...state, isAuthenticating: true };
    case `${GET_CERTIFICATE_LIST}_${SUCCESS}`:
      return {
        ...state,
        isUserValid: true,
        getCertificateList: { ...payload },
      };
    case `${GET_CERTIFICATE_LIST}_${FAIL}`:
      return {
        ...state,
        isAuthenticating: false,
        isUserValid: false,
        error: { ...payload },
      };

    case GET_PRODUCT_BY_CATEGORY:
      return { ...state, isAuthenticating: true };
    case `${GET_PRODUCT_BY_CATEGORY}_${SUCCESS}`:
      return {
        ...state,
        isUserValid: true,
        getProductByCategory: { ...payload },
      };
    case `${GET_PRODUCT_BY_CATEGORY}_${FAIL}`:
      return {
        ...state,
        isAuthenticating: false,
        isUserValid: false,
        error: { ...payload },
      };
    case DELETE_PRODUCT_LIST:
      return { ...state, isAuthenticating: true };
    case `${DELETE_PRODUCT_LIST}_${SUCCESS}`:
      return {
        ...state,
        isUserValid: true,
        deleteProduct: { ...payload },
      };
    case `${DELETE_PRODUCT_LIST}_${FAIL}`:
      return {
        ...state,
        isAuthenticating: false,
        isUserValid: false,
        error: { ...payload },
      };

    case GET_PRODUCT_BY_ID:
      return { ...state, isAuthenticating: true };
    case `${GET_PRODUCT_BY_ID}_${SUCCESS}`:
      return {
        ...state,
        isUserValid: true,
        getProductById: { ...payload },
      };
    case `${GET_PRODUCT_BY_ID}_${FAIL}`:
      return {
        ...state,
        isAuthenticating: false,
        isUserValid: false,
        error: { ...payload },
      };
    case IMAGE_UPLOAD:
      return { ...state, isAuthenticating: true };
    case `${IMAGE_UPLOAD}_${SUCCESS}`:
      return {
        ...state,
        isUserValid: true,
        imgUpload: { ...payload },
      };
    case `${IMAGE_UPLOAD}_${FAIL}`:
      return {
        ...state,
        isAuthenticating: false,
        isUserValid: false,
        error: { ...payload },
      };

    case GET_LATEST_PRODUCT:
      return { ...state, isAuthenticating: true };
    case `${GET_LATEST_PRODUCT}_${SUCCESS}`:
      return {
        ...state,
        isUserValid: true,
        getLatestProduct: { ...payload },
      };
    case `${GET_LATEST_PRODUCT}_${FAIL}`:
      return {
        ...state,
        isAuthenticating: false,
        isUserValid: false,
        error: { ...payload },
      };
    case ADD_CATEGORY:
      return { ...state, isAuthenticating: true };
    case `${ADD_CATEGORY}_${SUCCESS}`:
      return {
        ...state,
        isUserValid: true,
        getLatestProduct: { ...payload },
      };
    case `${ADD_CATEGORY}_${FAIL}`:
      return {
        ...state,
        isAuthenticating: false,
        isUserValid: false,
        error: { ...payload },
      };
    case GET_CATEGORY_LIST:
      return { ...state, isAuthenticating: true };
    case `${GET_CATEGORY_LIST}_${SUCCESS}`:
      return {
        ...state,
        isUserValid: true,
        getCategoryList: { ...payload },
      };
    case `${GET_CATEGORY_LIST}_${FAIL}`:
      return {
        ...state,
        isAuthenticating: false,
        isUserValid: false,
        error: { ...payload },
      };

    case ADD_TO_LATEST:
      return { ...state, isAuthenticating: true };
    case `${ADD_TO_LATEST}_${SUCCESS}`:
      return {
        ...state,
        isUserValid: true,
        addToLatest: { ...payload },
      };
    case `${ADD_TO_LATEST}_${FAIL}`:
      return {
        ...state,
        isAuthenticating: false,
        isUserValid: false,
        error: { ...payload },
      };
    case GET_LAST_PRODUCT:
      return { ...state, isAuthenticating: true };
    case `${GET_LAST_PRODUCT}_${SUCCESS}`:
      return {
        ...state,
        isUserValid: true,
        addToLatest: { ...payload },
      };
    case `${GET_LAST_PRODUCT}_${FAIL}`:
      return {
        ...state,
        isAuthenticating: false,
        isUserValid: false,
        error: { ...payload },
      };
    case IS_VISIBLE_PRODUCT:
      return { ...state, isAuthenticating: true };
    case `${IS_VISIBLE_PRODUCT}_${SUCCESS}`:
      return {
        ...state,
        isUserValid: true,
        addToLatest: { ...payload },
      };
    case `${IS_VISIBLE_PRODUCT}_${FAIL}`:
      return {
        ...state,
        isAuthenticating: false,
        isUserValid: false,
        error: { ...payload },
      };
    case IS_VISIBLE_CATEGORY:
      return { ...state, isAuthenticating: true };
    case `${IS_VISIBLE_CATEGORY}_${SUCCESS}`:
      return {
        ...state,
        isUserValid: true,
        addToLatest: { ...payload },
      };
    case `${IS_VISIBLE_CATEGORY}_${FAIL}`:
      return {
        ...state,
        isAuthenticating: false,
        isUserValid: false,
        error: { ...payload },
      };

    default:
      return state;
  }
};
