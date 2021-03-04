import {Dispatch, Middleware, MiddlewareAPI} from "redux";
import {
  ActionTypes as AuctionActionTypes,
  addLocalAuction,
  State as AuctionState,
} from "../ducks/auctions";
import {
  ActionTypes as AppActionTypes,
  State as AppState,
  updateAPI,
} from "../ducks/app";

type Action = {
  type: string;
  payload: any;
  meta?: any;
  error?: boolean;
};

const LOCAL_AUCTIONS_LS_KEY = 'local_auctions';
const HSD_API_LS_KEY = 'hsd_api';

const ls: Middleware = ({ getState }: MiddlewareAPI) => (dispatch: Dispatch) => (action: Action) => {
  const result = dispatch(action);
  const state: {
    auctions: AuctionState;
    app: AppState;
  } = getState();

  switch (action.type) {
    case AppActionTypes.UPDATE_API:
      persistAPI();
      break;
    case AuctionActionTypes.ADD_LOCAL_AUCTION:
      persistLocalAuctions();
      break;
    case AppActionTypes.INIT_APP:
      restoreLocalAuctions();
      restoreAPI();
      break;
  }

  return result;

  function restoreAPI() {
    try {
      const jsonString = localStorage.getItem(HSD_API_LS_KEY);

      if (jsonString) {
        const json: {apiHost: string; apiKey: string} = JSON.parse(jsonString);
        dispatch(updateAPI(json.apiHost, json.apiKey));
      }
    } catch (e) {
      console.error(e);
    }
  }

  function restoreLocalAuctions() {
    try {
      const jsonString = localStorage.getItem(LOCAL_AUCTIONS_LS_KEY);

      if (jsonString) {
        const json: AuctionState['local'] = JSON.parse(jsonString);
        json.forEach(auctionState => dispatch(addLocalAuction(auctionState)));
      }
    } catch (e) {
      console.error(e);
    }
  }

  function persistLocalAuctions() {
    try {
      localStorage.setItem(LOCAL_AUCTIONS_LS_KEY, JSON.stringify(state.auctions.local));
    } catch (e) {
      console.error(e);
    }
  }

  function persistAPI() {
    try {
      localStorage.setItem(HSD_API_LS_KEY, JSON.stringify({
        apiHost: state.app.apiHost,
        apiKey: state.app.apiKey,
      }));
    } catch (e) {
      console.error(e);
    }
  }
};

export default ls;
