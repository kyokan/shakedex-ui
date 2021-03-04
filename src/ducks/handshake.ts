import {Dispatch} from "redux";
import {useSelector} from "react-redux";
import deepEqual from "deep-equal";
import NodeClient from "../util/nodeclient";

enum ActionType {
  SET_INFO = 'handshake/setInfo',
}

type Action<payload> = {
  type: ActionType;
  payload: payload;
  meta?: any;
  error?: any;
}

type State = {
  hash: string;
  height: number;
  time: number;
}

const initialState: State = {
  hash: '',
  height: -1,
  time: -1,
};

export const setInfo = (hash: string, height: number, time: number): Action<{hash: string; height: number; time: number}> => {
  return {
    type: ActionType.SET_INFO,
    payload: {
      hash,
      height,
      time,
    },
  };
};

export const fetchHandshake = () => async (dispatch: Dispatch, getState: () => { app: { apiHost: string; apiKey: string} }) => {
  const { app: { apiHost, apiKey } } = getState();
  const nodeClient = new NodeClient({ apiHost, apiKey });
  const blockchanInfo = await nodeClient.getBlockchainInfo();
  const block = await nodeClient.getBlock(blockchanInfo!.result!.bestblockhash);
  const {
    hash,
    height,
    time,
  } = block.result || {};

  dispatch(setInfo(hash, height, time));
};

export default function handshakeReducer(state = initialState, action: Action<any>): State {
  switch (action.type) {
    case ActionType.SET_INFO:
      return {
        hash: action.payload.hash,
        height: action.payload.height,
        time: action.payload.time,
      };
    default:
      return state;
  }
}

export const useHandshakeInfo = () => {
  return useSelector((state: { handshake: State }): State => {
    return state.handshake;
  }, (a, b) => deepEqual(a, b));
};

export const useCurrentBlocktime = () => {
  return useSelector((state: { handshake: State }): Date => {
    const {time} = state.handshake;
    return new Date(time * 1000);
  }, (a, b) => deepEqual(a, b));
};
