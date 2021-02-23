import {shallowEqual, useSelector} from "react-redux";

export enum ActionTypes {
  INIT_APP = 'app/initApp',
}

type State = {
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
  apiKey: '028b0965978137223fb9d132de96993c',
};

export const initApp = (): Action<undefined> => ({
  type: ActionTypes.INIT_APP,
});

export default function appReducer(state: State = initialState, action: Action<any>): State {
  switch (action.type) {
    default:
      return state;
  }
}

export const useAPI = () => {
  return useSelector((state: { app: State}) => {
    return state.app;
  }, shallowEqual);
};
