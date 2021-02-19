enum AppActionTypes {
  INIT_APP = 'app/initApp',
}

type AppState = {

}

type AppAction = {
  type: AppActionTypes;
  payload?: any;
  meta?: any;
  error?: boolean;
}

const initialState: AppState = {

};

export default function appReducer(state: AppState = initialState, action: AppAction): AppState {
  switch (action.type) {
    case AppActionTypes.INIT_APP:
      return state;
    default:
      return state;
  }
}
