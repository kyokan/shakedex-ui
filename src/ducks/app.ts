import {shallowEqual, useSelector} from "react-redux";
import deepEqual from "deep-equal";

export enum ActionTypes {
  INIT_APP = 'app/initApp',
  UPDATE_API = 'app/updateAPI',
}

export type State = {
  apiHost: string;
  apiKey: string;
}

type Action<payload> = {
  type: ActionTypes;
  payload?: payload;
  meta?: any;
  error?: boolean;
}

const initialState: State = {
  apiHost: 'https://5pi.io/hsd',
  apiKey: '',
};

export const initApp = (): Action<undefined> => ({
  type: ActionTypes.INIT_APP,
});

export const updateAPI = (apiHost: string, apiKey = ''): Action<{apiHost: string; apiKey?: string}> => ({
  type: ActionTypes.UPDATE_API,
  payload: { apiHost, apiKey },
});

export default function appReducer(state: State = initialState, action: Action<any>): State {
  switch (action.type) {
    case ActionTypes.UPDATE_API:
      return {
        ...state,
        apiHost: action.payload.apiHost,
        apiKey: action.payload.apiKey,
      };
    default:
      return state;
  }
}

export const useAPI = () => {
  return useSelector((state: { app: State}) => {
    return state.app;
  }, (a, b) => deepEqual(a, b));
};
