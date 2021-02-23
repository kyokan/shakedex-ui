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
  apiKey: 'f744af94bed3cf493b34fa6e2a7c62a421601039',
};

export default function appReducer(state: AppState = initialState, action: AppAction): AppState {
  switch (action.type) {
    case AppActionTypes.INIT_APP:
      return state;
    default:
      return state;
  }
}
