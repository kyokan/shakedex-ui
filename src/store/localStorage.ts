import {Dispatch, Middleware, MiddlewareAPI} from "redux";
import {ActionTypes as AuctionActionTypes, addLocalAuction, State as AuctionState} from "../ducks/auctions";
import {ActionTypes as AppActionTypes} from "../ducks/app";

type Action = {
  type: string;
  payload: any;
  meta?: any;
  error?: boolean;
};

const LOCAL_AUCTIONS_LS_KEY = 'local_auctions';

const ls: Middleware = ({ getState }: MiddlewareAPI) => (dispatch: Dispatch) => (action: Action) => {
  const result = dispatch(action);
  const state: {
    auctions: AuctionState;
  } = getState();

  switch (action.type) {
    case AuctionActionTypes.ADD_LOCAL_AUCTION:
      persistLocalAuctions();
      break;
    case AppActionTypes.INIT_APP:
      restoreLocalAuctions();
      break;
  }

  return result;

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
};

export default ls;
