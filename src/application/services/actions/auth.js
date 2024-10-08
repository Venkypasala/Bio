import {
  SUCCESS,
  FAIL,
  LOGIN,
  LOGOUT,
  GET_PRODUCT_LIST,
  GET_PRODUCT_LIST_FILTER,
  GET_CERTIFICATE_LIST,
  GET_PRODUCT_BY_CATEGORY,
  DELETE_PRODUCT_LIST,
  POST_PRODUCT_LIST,
  GET_PRODUCT_BY_ID,
  IMAGE_UPLOAD,
  GET_LATEST_PRODUCT,
  GET_CATEGORY_LIST,
  GET_CATEGORY_LIST_FILTER,
  POST_CONTACT_LIST,
  ADD_CATEGORY,
  ADD_TO_LATEST,
  GET_LAST_PRODUCT,
  IS_VISIBLE_PRODUCT,
  IS_VISIBLE_CATEGORY,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  GET_PRODUCT_BY_PRODUCT,
  FORGOT_PASSWORD,
  PRODUCT_CATEGORY,
  SEARCH_PRODUCT_API,
  REFRESH_TOKEN,
} from "../../action-types";

export const logIn = (payloadData) => (dispatch) =>
  dispatch({
    type: LOGIN,
    payload: {
      request: {
        url: "api/bio-organics/v1/login",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: payloadData,
      },
      options: {
        onSuccess({ response }) {
          const { data, error } = response;
          if (data.status === 200) {
            dispatch({
              type: `${LOGIN}_${SUCCESS}`,
              payload: { ...data, ...payloadData },
            });

            return Promise.resolve({ ...data });
          }
          dispatch({
            type: `${LOGIN}_${FAIL}`,
            payload: { ...data },
          });
          return Promise.reject(data);
        },
        onError(exception) {
          if (exception.error.isAxiosError) {
            const {
              response: { data: dataError },
            } = exception.error;
            dispatch({ type: `${LOGIN}_${FAIL}`, payload: { dataError } });
            return Promise.reject(dataError);
          }
          dispatch({ type: `${LOGIN}_${FAIL}`, payload: {} });
          return Promise.reject();
        },
      },
    },
  });

export const refreshesToken = (payloadData, accessToken) => (dispatch) =>
  dispatch({
    type: REFRESH_TOKEN,
    payload: {
      request: {
        url: "api/bio-organics/v1/refreshToken",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        data: payloadData,
      },
      options: {
        onSuccess({ response }) {
          const { data, error } = response;
          if (data.status === 200) {
            dispatch({
              type: `${REFRESH_TOKEN}_${SUCCESS}`,
              payload: { ...data, ...payloadData },
            });

            return Promise.resolve({ ...data });
          }
          dispatch({
            type: `${REFRESH_TOKEN}_${FAIL}`,
            payload: { ...data },
          });
          return Promise.reject(data);
        },
        onError(exception) {
          if (exception.error.isAxiosError) {
            const {
              response: { data: dataError },
            } = exception.error;
            dispatch({
              type: `${REFRESH_TOKEN}_${FAIL}`,
              payload: { dataError },
            });
            return Promise.reject(dataError);
          }
          dispatch({ type: `${REFRESH_TOKEN}_${FAIL}`, payload: {} });
          return Promise.reject();
        },
      },
    },
  });

export const Logout = () => (dispatch) => {
  dispatch({
    type: `${LOGOUT}_${SUCCESS}`,
  });
};

export const getListOfProduct = (payloadData, accessToken) => (dispatch) =>
  dispatch({
    type: GET_PRODUCT_LIST,
    payload: {
      request: {
        url: "/api/bio-organics/v1/products",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        data: payloadData,
      },
      options: {
        onSuccess({ response }) {
          const { data, error } = response;
          if (data.status === 200) {
            dispatch({
              type: `${GET_PRODUCT_LIST}_${SUCCESS}`,
              payload: { ...data, ...payloadData },
            });

            return Promise.resolve({ ...data });
          }
          dispatch({
            type: `${GET_PRODUCT_LIST}_${FAIL}`,
            payload: { ...data },
          });
          return Promise.reject(data);
        },
        onError(exception) {
          if (exception.error.isAxiosError) {
            const {
              response: { data: dataError },
            } = exception.error;
            dispatch({
              type: `${GET_PRODUCT_LIST}_${FAIL}`,
              payload: { dataError },
            });
            return Promise.reject(dataError);
          }
          dispatch({ type: `${GET_PRODUCT_LIST}_${FAIL}`, payload: {} });
          return Promise.reject();
        },
      },
    },
  });
export const getListOfFilteredProduct = (payloadData) => (dispatch) =>
  dispatch({
    type: GET_PRODUCT_LIST_FILTER,
    payload: {
      request: {
        url: "/api/bio-organics/v1/product/onfilter",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: payloadData,
      },
      options: {
        onSuccess({ response }) {
          const { data, error } = response;
          if (data.status === 200) {
            dispatch({
              type: `${GET_PRODUCT_LIST_FILTER}_${SUCCESS}`,
              payload: { ...data, ...payloadData },
            });

            return Promise.resolve({ ...data });
          }
          dispatch({
            type: `${GET_PRODUCT_LIST_FILTER}_${FAIL}`,
            payload: { ...data },
          });
          return Promise.reject(data);
        },
        onError(exception) {
          if (exception.error.isAxiosError) {
            const {
              response: { data: dataError },
            } = exception.error;
            dispatch({
              type: `${GET_PRODUCT_LIST_FILTER}_${FAIL}`,
              payload: { dataError },
            });
            return Promise.reject(dataError);
          }
          dispatch({ type: `${GET_PRODUCT_LIST_FILTER}_${FAIL}`, payload: {} });
          return Promise.reject();
        },
      },
    },
  });

export const getCertificateList = (payloadData) => (dispatch) =>
  dispatch({
    type: GET_CERTIFICATE_LIST,
    payload: {
      request: {
        url: "/api/bio-organics/v1/certificates",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: payloadData,
      },
      options: {
        onSuccess({ response }) {
          const { data, error } = response;

          if (data.status === 200) {
            dispatch({
              type: `${GET_CERTIFICATE_LIST}_${SUCCESS}`,
              payload: { ...data, ...payloadData },
            });

            return Promise.resolve({ ...data });
          }
          dispatch({
            type: `${GET_CERTIFICATE_LIST}_${FAIL}`,
            payload: { ...data },
          });
          return Promise.reject(data);
        },
        onError(exception) {
          if (exception.error.isAxiosError) {
            const {
              response: { data: dataError },
            } = exception.error;
            dispatch({
              type: `${GET_CERTIFICATE_LIST}_${FAIL}`,
              payload: { dataError },
            });
            return Promise.reject(dataError);
          }
          dispatch({ type: `${GET_CERTIFICATE_LIST}_${FAIL}`, payload: {} });
          return Promise.reject();
        },
      },
    },
  });

export const getProductByCategory = (payloadData) => (dispatch) =>
  dispatch({
    type: GET_PRODUCT_BY_CATEGORY,
    payload: {
      request: {
        url: "/api/bio-organics/v1/product/onfilter",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: payloadData,
      },
      options: {
        onSuccess({ response }) {
          const { data, error } = response;

          if (data.status === 200) {
            dispatch({
              type: `${GET_PRODUCT_BY_CATEGORY}_${SUCCESS}`,
              payload: { ...data, ...payloadData },
            });

            return Promise.resolve({ ...data });
          }
          dispatch({
            type: `${GET_PRODUCT_BY_CATEGORY}_${FAIL}`,
            payload: { ...data },
          });
          return Promise.reject(data);
        },
        onError(exception) {
          if (exception.error.isAxiosError) {
            const {
              response: { data: dataError },
            } = exception.error;
            dispatch({
              type: `${GET_PRODUCT_BY_CATEGORY}_${FAIL}`,
              payload: { dataError },
            });
            return Promise.reject(dataError);
          }
          dispatch({ type: `${GET_PRODUCT_BY_CATEGORY}_${FAIL}`, payload: {} });
          return Promise.reject();
        },
      },
    },
  });

export const getRelatedProductList = (payloadData) => (dispatch) =>
  dispatch({
    type: GET_PRODUCT_BY_PRODUCT,
    payload: {
      request: {
        url: "/api/bio-organics/v1/product/relations",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: payloadData,
      },
      options: {
        onSuccess({ response }) {
          const { data, error } = response;

          if (data.status === 200) {
            dispatch({
              type: `${GET_PRODUCT_BY_PRODUCT}_${SUCCESS}`,
              payload: { ...data, ...payloadData },
            });

            return Promise.resolve({ ...data });
          }
          dispatch({
            type: `${GET_PRODUCT_BY_PRODUCT}_${FAIL}`,
            payload: { ...data },
          });
          return Promise.reject(data);
        },
        onError(exception) {
          if (exception.error.isAxiosError) {
            const {
              response: { data: dataError },
            } = exception.error;
            dispatch({
              type: `${GET_PRODUCT_BY_PRODUCT}_${FAIL}`,
              payload: { dataError },
            });
            return Promise.reject(dataError);
          }
          dispatch({ type: `${GET_PRODUCT_BY_PRODUCT}_${FAIL}`, payload: {} });
          return Promise.reject();
        },
      },
    },
  });

export const postEnquiryList = (payload) => (dispatch) =>
  dispatch({
    type: POST_PRODUCT_LIST,
    payload: {
      request: {
        url: "api/bio-organics/v1/user/enquiry",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: payload,
      },
      options: {
        onSuccess({ response }) {
          const { data, error } = response;
          if (data.status === 200) {
            dispatch({
              type: `${POST_PRODUCT_LIST}_${SUCCESS}`,
              payload: { ...data, ...payload },
            });

            return Promise.resolve({ ...data });
          }
          dispatch({
            type: `${POST_PRODUCT_LIST}_${FAIL}`,
            payload: { ...data },
          });
          return Promise.reject(data);
        },
        onError(exception) {
          if (exception.error.isAxiosError) {
            const {
              response: { data: dataError },
            } = exception.error;
            dispatch({
              type: `${POST_PRODUCT_LIST}_${FAIL}`,
              payload: { dataError },
            });
            return Promise.reject(dataError);
          }
          dispatch({ type: `${POST_PRODUCT_LIST}_${FAIL}`, payload: {} });
          return Promise.reject();
        },
      },
    },
  });

export const deleteListOfProductList =
  (payloadData, accessToken) => (dispatch) =>
    dispatch({
      type: DELETE_PRODUCT_LIST,
      payload: {
        request: {
          url: "/api/bio-organics/v1/delete/product",
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          data: payloadData,
        },
        options: {
          onSuccess({ response }) {
            const { data, error } = response;
            if (data.status === 200) {
              dispatch({
                type: `${DELETE_PRODUCT_LIST}_${SUCCESS}`,
                payload: { ...data, ...payloadData },
              });

              return Promise.resolve({ ...data });
            }
            dispatch({
              type: `${DELETE_PRODUCT_LIST}_${FAIL}`,
              payload: { ...data },
            });
            return Promise.reject(data);
          },
          onError(exception) {
            if (exception.error.isAxiosError) {
              const {
                response: { data: dataError },
              } = exception.error;
              dispatch({
                type: `${DELETE_PRODUCT_LIST}_${FAIL}`,
                payload: { dataError },
              });
              return Promise.reject(dataError);
            }
            dispatch({ type: `${DELETE_PRODUCT_LIST}_${FAIL}`, payload: {} });
            return Promise.reject();
          },
        },
      },
    });

export const getProductById = (productId) => (dispatch) =>
  dispatch({
    type: GET_PRODUCT_BY_ID,
    payload: {
      request: {
        url: `/api/bio-organics/v1/product/${productId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      options: {
        onSuccess({ response }) {
          const { data, error } = response;
          if (data.status === 200) {
            dispatch({
              type: `${GET_PRODUCT_BY_ID}_${SUCCESS}`,
              payload: { ...data },
            });

            return Promise.resolve({ ...data });
          }
          dispatch({
            type: `${GET_PRODUCT_BY_ID}_${FAIL}`,
            payload: { ...data },
          });
          return Promise.reject(data);
        },
        onError(exception) {
          if (exception.error.isAxiosError) {
            const {
              response: { data: dataError },
            } = exception.error;
            dispatch({
              type: `${GET_PRODUCT_BY_ID}_${FAIL}`,
              payload: { dataError },
            });
            return Promise.reject(dataError);
          }
          dispatch({ type: `${GET_PRODUCT_BY_ID}_${FAIL}`, payload: {} });
          return Promise.reject();
        },
      },
    },
  });

export const imgUpload = (payloadData, accessToken) => (dispatch) =>
  dispatch({
    type: IMAGE_UPLOAD,
    payload: {
      request: {
        url: `/api/bio-organics/v1/product/image`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        data: payloadData,
      },
      options: {
        onSuccess({ response }) {
          const { data, error } = response;
          if (data.status === 200) {
            dispatch({
              type: `${IMAGE_UPLOAD}_${SUCCESS}`,
              payload: { ...data },
            });

            return Promise.resolve({ ...data });
          }
          dispatch({
            type: `${IMAGE_UPLOAD}_${FAIL}`,
            payload: { ...data },
          });
          return Promise.reject(data);
        },
        onError(exception) {
          if (exception.error.isAxiosError) {
            const {
              response: { data: dataError },
            } = exception.error;
            dispatch({
              type: `${IMAGE_UPLOAD}_${FAIL}`,
              payload: { dataError },
            });
            return Promise.reject(dataError);
          }
          dispatch({ type: `${IMAGE_UPLOAD}_${FAIL}`, payload: {} });
          return Promise.reject();
        },
      },
    },
  });
export const getLatestProduct = (payloadData) => (dispatch) =>
  dispatch({
    type: GET_LATEST_PRODUCT,
    payload: {
      request: {
        url: "/api/bio-organics/v1/products/latest",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: payloadData,
      },
      options: {
        onSuccess({ response }) {
          const { data, error } = response;

          if (data.status === 200) {
            dispatch({
              type: `${GET_LATEST_PRODUCT}_${SUCCESS}`,
              payload: { ...data, ...payloadData },
            });
            return Promise.resolve({ ...data });
          }
          dispatch({
            type: `${GET_LATEST_PRODUCT}_${FAIL}`,
            payload: { ...data },
          });
          return Promise.reject(data);
        },
        onError(exception) {
          if (exception.error.isAxiosError) {
            const {
              response: { data: dataError },
            } = exception.error;
            dispatch({
              type: `${GET_LATEST_PRODUCT}_${FAIL}`,
              payload: { dataError },
            });
            return Promise.reject(dataError);
          }
          dispatch({ type: `${GET_LATEST_PRODUCT}_${FAIL}`, payload: {} });
          return Promise.reject();
        },
      },
    },
  });

export const getCategoryList = (payloadData) => (dispatch) =>
  dispatch({
    type: GET_CATEGORY_LIST,
    payload: {
      request: {
        url: "/api/bio-organics/v1/categories",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: payloadData,
      },
      options: {
        onSuccess({ response }) {
          const { data, error } = response;

          if (data.status === 200) {
            dispatch({
              type: `${GET_CATEGORY_LIST}_${SUCCESS}`,
              payload: { ...data, ...payloadData },
            });

            return Promise.resolve({ ...data });
          }
          dispatch({
            type: `${GET_CATEGORY_LIST}_${FAIL}`,
            payload: { ...data },
          });
          return Promise.reject(data);
        },
        onError(exception) {
          if (exception.error.isAxiosError) {
            const {
              response: { data: dataError },
            } = exception.error;
            dispatch({
              type: `${GET_CATEGORY_LIST}_${FAIL}`,
              payload: { dataError },
            });
            return Promise.reject(dataError);
          }
          dispatch({ type: `${GET_CATEGORY_LIST}_${FAIL}`, payload: {} });
          return Promise.reject();
        },
      },
    },
  });
export const getFilteredCategoryList = (payloadData) => (dispatch) =>
  dispatch({
    type: GET_CATEGORY_LIST_FILTER,
    payload: {
      request: {
        url: "/api/bio-organics/v1/category/onfilter",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: payloadData,
      },
      options: {
        onSuccess({ response }) {
          const { data, error } = response;

          if (data.status === 200) {
            dispatch({
              type: `${GET_CATEGORY_LIST_FILTER}_${SUCCESS}`,
              payload: { ...data, ...payloadData },
            });

            return Promise.resolve({ ...data });
          }
          dispatch({
            type: `${GET_CATEGORY_LIST_FILTER}_${FAIL}`,
            payload: { ...data },
          });
          return Promise.reject(data);
        },
        onError(exception) {
          if (exception.error.isAxiosError) {
            const {
              response: { data: dataError },
            } = exception.error;
            dispatch({
              type: `${GET_CATEGORY_LIST_FILTER}_${FAIL}`,
              payload: { dataError },
            });
            return Promise.reject(dataError);
          }
          dispatch({
            type: `${GET_CATEGORY_LIST_FILTER}_${FAIL}`,
            payload: {},
          });
          return Promise.reject();
        },
      },
    },
  });
export const addCategory = (payloadData, accessToken) => (dispatch) =>
  dispatch({
    type: ADD_CATEGORY,
    payload: {
      request: {
        url: "/api/bio-organics/v1/category",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        data: payloadData,
      },
      options: {
        onSuccess({ response }) {
          const { data, error } = response;

          if (data.status === 200) {
            dispatch({
              type: `${ADD_CATEGORY}_${SUCCESS}`,
              payload: { ...data, ...payloadData },
            });

            return Promise.resolve({ ...data });
          }
          dispatch({
            type: `${ADD_CATEGORY}_${FAIL}`,
            payload: { ...data },
          });
          return Promise.reject(data);
        },
        onError(exception) {
          if (exception.error.isAxiosError) {
            const {
              response: { data: dataError },
            } = exception.error;
            dispatch({
              type: `${ADD_CATEGORY}_${FAIL}`,
              payload: { dataError },
            });
            return Promise.reject(dataError);
          }
          dispatch({ type: `${ADD_CATEGORY}_${FAIL}`, payload: {} });
          return Promise.reject();
        },
      },
    },
  });
export const createProduct = (payloadData, accessToken) => (dispatch) =>
  dispatch({
    type: CREATE_PRODUCT,
    payload: {
      request: {
        url: "/api/bio-organics/v1/product/create",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        data: payloadData,
      },
      options: {
        onSuccess({ response }) {
          const { data, error } = response;

          if (data.status === 200) {
            dispatch({
              type: `${CREATE_PRODUCT}_${SUCCESS}`,
              payload: { ...data, ...payloadData },
            });

            return Promise.resolve({ ...data });
          }
          dispatch({
            type: `${CREATE_PRODUCT}_${FAIL}`,
            payload: { ...data },
          });
          return Promise.reject(data);
        },
        onError(exception) {
          if (exception.error.isAxiosError) {
            const {
              response: { data: dataError },
            } = exception.error;
            dispatch({
              type: `${CREATE_PRODUCT}_${FAIL}`,
              payload: { dataError },
            });
            return Promise.reject(dataError);
          }
          dispatch({ type: `${CREATE_PRODUCT}_${FAIL}`, payload: {} });
          return Promise.reject();
        },
      },
    },
  });
export const updateProduct = (payloadData, accessToken) => (dispatch) =>
  dispatch({
    type: UPDATE_PRODUCT,
    payload: {
      request: {
        url: "/api/bio-organics/v1/product/update",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        data: payloadData,
      },
      options: {
        onSuccess({ response }) {
          const { data, error } = response;

          if (data.status === 200) {
            dispatch({
              type: `${UPDATE_PRODUCT}_${SUCCESS}`,
              payload: { ...data, ...payloadData },
            });

            return Promise.resolve({ ...data });
          }
          dispatch({
            type: `${UPDATE_PRODUCT}_${FAIL}`,
            payload: { ...data },
          });
          return Promise.reject(data);
        },
        onError(exception) {
          if (exception.error.isAxiosError) {
            const {
              response: { data: dataError },
            } = exception.error;
            dispatch({
              type: `${UPDATE_PRODUCT}_${FAIL}`,
              payload: { dataError },
            });
            return Promise.reject(dataError);
          }
          dispatch({ type: `${UPDATE_PRODUCT}_${FAIL}`, payload: {} });
          return Promise.reject();
        },
      },
    },
  });
export const postContactList = (payload) => (dispatch) =>
  dispatch({
    type: POST_CONTACT_LIST,
    payload: {
      request: {
        url: "api/bio-organics/v1/user/contact",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: payload,
      },
      options: {
        onSuccess({ response }) {
          const { data, error } = response;
          if (data.status === 200) {
            dispatch({
              type: `${POST_CONTACT_LIST}_${SUCCESS}`,
              payload: { ...data, ...payload },
            });

            return Promise.resolve({ ...data });
          }
          dispatch({
            type: `${POST_CONTACT_LIST}_${FAIL}`,
            payload: { ...data },
          });
          return Promise.reject(data);
        },
        onError(exception) {
          if (exception.error.isAxiosError) {
            const {
              response: { data: dataError },
            } = exception.error;
            dispatch({
              type: `${POST_CONTACT_LIST}_${FAIL}`,
              payload: { dataError },
            });
            return Promise.reject(dataError);
          }
          dispatch({ type: `${POST_CONTACT_LIST}_${FAIL}`, payload: {} });
          return Promise.reject();
        },
      },
    },
  });
export const productCategory = (payload) => (dispatch) =>
  dispatch({
    type: PRODUCT_CATEGORY,
    payload: {
      request: {
        url: "api/bio-organics/v1/category/product",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: payload,
      },
      options: {
        onSuccess({ response }) {
          const { data, error } = response;
          if (data.status === 200) {
            dispatch({
              type: `${PRODUCT_CATEGORY}_${SUCCESS}`,
              payload: { ...data, ...payload },
            });

            return Promise.resolve({ ...data });
          }
          dispatch({
            type: `${PRODUCT_CATEGORY}_${FAIL}`,
            payload: { ...data },
          });
          return Promise.reject(data);
        },
        onError(exception) {
          if (exception.error.isAxiosError) {
            const {
              response: { data: dataError },
            } = exception.error;
            dispatch({
              type: `${PRODUCT_CATEGORY}_${FAIL}`,
              payload: { dataError },
            });
            return Promise.reject(dataError);
          }
          dispatch({ type: `${PRODUCT_CATEGORY}_${FAIL}`, payload: {} });
          return Promise.reject();
        },
      },
    },
  });

export const addToLatest = (payload) => (dispatch) =>
  dispatch({
    type: ADD_TO_LATEST,
    payload: {
      request: {
        url: "/api/bio-organics/v1/product/add/latest",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: payload,
      },
      options: {
        onSuccess({ response }) {
          const { data, error } = response;
          if (data.status === 200) {
            dispatch({
              type: `${ADD_TO_LATEST}_${SUCCESS}`,
              payload: { ...data, ...payload },
            });

            return Promise.resolve({ ...data });
          }
          dispatch({
            type: `${ADD_TO_LATEST}_${FAIL}`,
            payload: { ...data },
          });
          return Promise.reject(data);
        },
        onError(exception) {
          if (exception.error.isAxiosError) {
            const {
              response: { data: dataError },
            } = exception.error;
            dispatch({
              type: `${ADD_TO_LATEST}_${FAIL}`,
              payload: { dataError },
            });
            return Promise.reject(dataError);
          }
          dispatch({ type: `${ADD_TO_LATEST}_${FAIL}`, payload: {} });
          return Promise.reject();
        },
      },
    },
  });
export const searchProduct = (payload) => (dispatch) =>
  dispatch({
    type: SEARCH_PRODUCT_API,
    payload: {
      request: {
        url: "/api/bio-organics/v1/product/onsearch",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: payload,
      },
      options: {
        onSuccess({ response }) {
          const { data, error } = response;
          if (data.status === 200) {
            dispatch({
              type: `${SEARCH_PRODUCT_API}_${SUCCESS}`,
              payload: { ...data, ...payload },
            });

            return Promise.resolve({ ...data });
          }
          dispatch({
            type: `${SEARCH_PRODUCT_API}_${FAIL}`,
            payload: { ...data },
          });
          return Promise.reject(data);
        },
        onError(exception) {
          if (exception.error.isAxiosError) {
            const {
              response: { data: dataError },
            } = exception.error;
            dispatch({
              type: `${SEARCH_PRODUCT_API}_${FAIL}`,
              payload: { dataError },
            });
            return Promise.reject(dataError);
          }
          dispatch({ type: `${SEARCH_PRODUCT_API}_${FAIL}`, payload: {} });
          return Promise.reject();
        },
      },
    },
  });
export const getLastProduct = () => (dispatch) =>
  dispatch({
    type: GET_LAST_PRODUCT,
    payload: {
      request: {
        url: "/api/bio-organics/v1/product/last",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      options: {
        onSuccess({ response }) {
          const { data, error } = response;

          if (data.status === 200) {
            dispatch({
              type: `${GET_LAST_PRODUCT}_${SUCCESS}`,
              payload: { ...data },
            });

            return Promise.resolve({ ...data });
          }
          dispatch({
            type: `${GET_LAST_PRODUCT}_${FAIL}`,
            payload: { ...data },
          });
          return Promise.reject(data);
        },
        onError(exception) {
          if (exception.error.isAxiosError) {
            const {
              response: { data: dataError },
            } = exception.error;
            dispatch({
              type: `${GET_LAST_PRODUCT}_${FAIL}`,
              payload: { dataError },
            });
            return Promise.reject(dataError);
          }
          dispatch({ type: `${GET_LAST_PRODUCT}_${FAIL}`, payload: {} });
          return Promise.reject();
        },
      },
    },
  });
export const isVisibleProduct = (payload, accessToken) => (dispatch) =>
  dispatch({
    type: IS_VISIBLE_PRODUCT,
    payload: {
      request: {
        url: "/api/bio-organics/v1/product/visible",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        data: payload,
      },
      options: {
        onSuccess({ response }) {
          const { data, error } = response;

          if (data.status === 200) {
            dispatch({
              type: `${IS_VISIBLE_PRODUCT}_${SUCCESS}`,
              payload: { ...data, ...payload },
            });

            return Promise.resolve({ ...data });
          }
          dispatch({
            type: `${IS_VISIBLE_PRODUCT}_${FAIL}`,
            payload: { ...data },
          });
          return Promise.reject(data);
        },
        onError(exception) {
          if (exception.error.isAxiosError) {
            const {
              response: { data: dataError },
            } = exception.error;
            dispatch({
              type: `${IS_VISIBLE_PRODUCT}_${FAIL}`,
              payload: { dataError },
            });
            return Promise.reject(dataError);
          }
          dispatch({ type: `${IS_VISIBLE_PRODUCT}_${FAIL}`, payload: {} });
          return Promise.reject();
        },
      },
    },
  });
export const isVisibleCategory = (payload, accessToken) => (dispatch) =>
  dispatch({
    type: IS_VISIBLE_CATEGORY,
    payload: {
      request: {
        url: "/api/bio-organics/v1/category/visible",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        data: payload,
      },
      options: {
        onSuccess({ response }) {
          const { data, error } = response;
          console.log("dataaaaa", data);
          console.log("error", error);
          if (data.status === 200) {
            dispatch({
              type: `${IS_VISIBLE_CATEGORY}_${SUCCESS}`,
              payload: { ...data, ...payload },
            });

            return Promise.resolve({ ...data });
          }
          dispatch({
            type: `${IS_VISIBLE_CATEGORY}_${FAIL}`,
            payload: { ...data },
          });
          return Promise.reject(data);
        },
        onError(exception) {
          if (exception.error.isAxiosError) {
            const {
              response: { data: dataError },
            } = exception.error;
            dispatch({
              type: `${IS_VISIBLE_CATEGORY}_${FAIL}`,
              payload: { dataError },
            });
            return Promise.reject(dataError);
          }
          dispatch({ type: `${IS_VISIBLE_CATEGORY}_${FAIL}`, payload: {} });
          return Promise.reject();
        },
      },
    },
  });

export const forgotPassword = (payload) => (dispatch) =>
  dispatch({
    type: FORGOT_PASSWORD,
    payload: {
      request: {
        url: "/api/bio-organics/v1/forgot/password",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: payload,
      },
      options: {
        onSuccess({ response }) {
          const { data, error } = response;

          if (data.status === 200) {
            dispatch({
              type: `${FORGOT_PASSWORD}_${SUCCESS}`,
              payload: { ...data, ...payload },
            });

            return Promise.resolve({ ...data });
          }
          dispatch({
            type: `${FORGOT_PASSWORD}_${FAIL}`,
            payload: { ...data },
          });
          return Promise.reject(data);
        },
        onError(exception) {
          if (exception.error.isAxiosError) {
            const {
              response: { data: dataError },
            } = exception.error;
            dispatch({
              type: `${FORGOT_PASSWORD}_${FAIL}`,
              payload: { dataError },
            });
            return Promise.reject(dataError);
          }
          dispatch({ type: `${FORGOT_PASSWORD}_${FAIL}`, payload: {} });
          return Promise.reject();
        },
      },
    },
  });
