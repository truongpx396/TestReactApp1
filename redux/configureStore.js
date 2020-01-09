import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import { phones } from "./phones";
import { favorites } from "./favorites";
import { conversations } from "./conversations";
import { persistStore, persistCombineReducers } from "redux-persist";
import storage from "redux-persist/es/storage";
// import AsyncStorage from "@react-native-community/async-storage";

export const ConfigureStore = () => {
  const config = {
    key: "root",
    storage,
    debug: true
  };

  const store = createStore(
    persistCombineReducers(config, {
      phones,
      favorites,
      conversations
    }),
    applyMiddleware(thunk, logger)
  );

  const persistor = persistStore(store);

  return { persistor, store };
};
