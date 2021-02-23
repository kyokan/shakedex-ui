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
  apiHost: 'http://5pi.io/hsd',
  apiKey: '028b0965978137223fb9d132de96993c',
};

export default function appReducer(state: AppState = initialState, action: AppAction): AppState {
  switch (action.type) {
    case AppActionTypes.INIT_APP:
      return state;
    default:
      return state;
  }
}
