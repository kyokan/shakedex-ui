import {createStore, applyMiddleware, combineReducers} from "redux";
import thunk from "redux-thunk";
import {createLogger} from "redux-logger";
import app from "../ducks/app";


const rootReducer = combineReducers({
  app,
});

export type AppRootState = ReturnType<typeof rootReducer>;

export default function configureAppStore() {
  return createStore(
    rootReducer,
    process.env.NODE_ENV === 'development'
      ? applyMiddleware(thunk, createLogger({
        collapsed: (getState, action = {}) => [''].includes(action.type),
      }))
      : applyMiddleware(thunk),
  );
}
