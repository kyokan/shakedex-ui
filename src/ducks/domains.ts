import {Dispatch} from "redux";
import {useSelector} from "react-redux";

enum ActionTypes {
  SET_DOMAIN = 'domains/setDomain',
}

type Domain = {
  tld: string,
  state: DomainStatus;
  owner: {
    hash: string;
  },
  stats: DomainStats;
}

export type DomainStatus = 'REVEAL' | 'BIDDING' | 'CLOSED' | 'OPENING' | null;

export type DomainStats = {
  renewalPeriodStart?: number;
  renewalPeriodEnd?: number;
  bidPeriodStart?: number;
  bidPeriodEnd?: number;
  openPeriodStart?: number;
  openPeriodEnd?: number;
  revealPeriodStart?: number;
  revealPeriodEnd?: number;
  available?: number;
};

type State = {
  [tld: string]: Domain;
}

type AppAction<payload> = {
  type: ActionTypes;
  payload: payload;
  meta?: any;
  error?: boolean;
}

const initialState: State = {};

export const fetchDomain = (tld: string) => async (dispatch: Dispatch, getState: () => { app: { apiHost: string; apiKey: string} }) => {
  const { app: { apiHost, apiKey } } = getState();
  if (!apiHost) throw new Error('missing RPC_URL environment variable');

  const resp = await fetch(apiHost, {
    method: 'POST',
    headers: {
      'Authorization': apiKey && 'Basic ' + Buffer.from(`x:${apiKey}`).toString('base64'),
    },
    body: JSON.stringify({
      method: 'getnameinfo',
      params: [tld],
    }),
  });

  const json = await resp.json();
  const { result } = json;
  const { start: available } = result.start;
  const { owner, stats, state } = result.info || {};
  const { hash: ownerHash = '' } = owner || {};
  const {
    renewalPeriodStart,
    renewalPeriodEnd,
    bidPeriodStart,
    bidPeriodEnd,
    openPeriodStart,
    openPeriodEnd,
    revealPeriodStart,
    revealPeriodEnd,
  } = stats || {};

  console.log(result);

  switch (state) {
    case 'REVEAL':
      dispatch(setDomain(tld, state, ownerHash, revealPeriodStart, revealPeriodEnd));
      break;
    case "BIDDING":
      dispatch(setDomain(tld, state, ownerHash, bidPeriodStart, bidPeriodEnd));
      break;
    case "OPENING":
      dispatch(setDomain(tld, state, ownerHash, openPeriodStart, openPeriodEnd));
      break;
    case "CLOSED":
      dispatch(setDomain(tld, state, ownerHash, renewalPeriodStart, renewalPeriodEnd));
      break;
    case null:
      dispatch(setDomain(tld, state, ownerHash, available, -1));
      break;
  }

};

export const setDomain = (
  tld: string,
  state: DomainStatus,
  ownerHash: string,
  start: number,
  end: number,
  ): AppAction<{tld: string; state: DomainStatus; ownerHash: string; start: number; end: number}> => {
  return {
    type: ActionTypes.SET_DOMAIN,
    payload: {
      tld,
      state,
      ownerHash,
      start,
      end,
    },
  };
};

export default function domainReducer(state: State = initialState, action: AppAction<any>): State {
  switch (action.type) {
    case ActionTypes.SET_DOMAIN:
      return reduceSetDomain(state, action);
    default:
      return state;
  }
}

function reduceSetDomain(
  state: State,
  action: AppAction<{tld: string; state: DomainStatus; ownerHash: string; start: number; end: number}>
): State {
  const {
    tld,
    state: auctionState,
    ownerHash,
    start,
    end,
  } = action.payload;

  state[tld] = makeDomain(tld, auctionState, ownerHash, start, end);

  return state;
}

function makeDomain(tld = '', state: DomainStatus = null, ownerHash: string = '', start: number = -1, end: number = -1): Domain {
  const stats: DomainStats = {};

  switch (state) {
    case "REVEAL":
      stats.revealPeriodStart = start;
      stats.revealPeriodEnd = end;
      break;
    case "BIDDING":
      stats.bidPeriodStart = start;
      stats.bidPeriodEnd = end;
      break;
    case "CLOSED":
      stats.renewalPeriodStart = start;
      stats.renewalPeriodEnd = end;
      break;
    case "OPENING":
      stats.openPeriodStart = start;
      stats.openPeriodEnd = end;
      break;
    case null:
      stats.available = start;
      break;
  }

  return {
    tld: tld,
    state: state,
    owner: {
      hash: ownerHash,
    },
    stats: stats,
  };
}

export const useDomain = (tld: string): Domain | undefined => {
  return useSelector((state: { domains: State }) => {
    return state.domains[tld];
  }, (a, b) => a?.tld === b?.tld);
};
