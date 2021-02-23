enum AppActionTypes {
  INIT_APP = 'app/initApp',
}

type AppState = {
  apiHost: string;
  apiKey: string;
}

type AppAction = {
  type: AppActionTypes;
  payload?: any;
  meta?: any;
  error?: boolean;
}

const initialState: AppState = {
  apiHost: 'http://localhost:12037',
  apiKey: 'f4b5e7547ce8b3eacfec37fd08e62643b3a24181',
};

export default function appReducer(state: AppState = initialState, action: AppAction): AppState {
  switch (action.type) {
    case AppActionTypes.INIT_APP:
      return state;
    default:
      return state;
  }
}
