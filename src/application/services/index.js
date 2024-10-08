import {
  legacy_createStore as createStore,
  compose,
  applyMiddleware,
} from "redux";
import axios from "axios";
import thunk from "redux-thunk";
import axiosMiddleware from "redux-axios-middleware";
import logger from "redux-logger";
import { baseURL } from "../config";
import appReducer from "./reducers";

const client = axios.create({
  baseURL,
  responseType: "json",
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
let middlewares = [thunk, axiosMiddleware(client)];

if (true) middlewares = [...middlewares, logger];

export default createStore(
  appReducer,
  composeEnhancers(applyMiddleware(...middlewares))
);
