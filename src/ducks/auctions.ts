import {Dispatch} from "redux";
import deepEqual from 'deep-equal';
import {useSelector} from "react-redux";
import {Auction} from "../util/auction";

export enum ActionTypes {
  UPLOAD_AUCTIONS = 'auctions/uploadAuctions',
  ADD_LOCAL_AUCTION = 'auctions/addLocalAuction',
}

type Action<payload> = {
  type: ActionTypes;
  payload: payload;
  meta?: any;
  error?: boolean;
}

export type State = {
  uploading: boolean;
  local: AuctionState[];
  remote: AuctionState[];
}

export type ProposalState = {
  lockTime: number;
  lockingOutputIdx: number;
  lockingTxHash: string;
  name: string;
  paymentAddr: string;
  price: number;
  publicKey: string;
  signature: string;
}

export type AuctionState = {
  params: {
    durationDays: number;
    endPrice: number;
    startPrice: number;
  },
  proposals: ProposalState[];
}

const initialState = {
  uploading: false,
  local: [],
  remote: [],
};

export const addLocalAuction = (auction: AuctionState): Action<AuctionState> => {
  return {
    type: ActionTypes.ADD_LOCAL_AUCTION,
    payload: auction,
  };
};

export const uploadAuctions = (filelist: FileList | null) => async (dispatch: Dispatch) => {
  if (!filelist) return;

  const files = Array.from(filelist);

  for (const file of files) {
    const json = await readJSON(file);
    assertAuction(json);
    dispatch(addLocalAuction(json as AuctionState));
  }
};

export default function auctionsReducer(state: State = initialState, action: Action<any>): State {
  switch (action.type) {
    case ActionTypes.ADD_LOCAL_AUCTION:
      return reduceAddLocalAuction(state, action);
    default:
      return state;
  }
}

function reduceAddLocalAuction(state: State, action: Action<AuctionState>): State {
  const { local } = state;
  const newAuctionState = action.payload;
  const newAuction = new Auction(newAuctionState);
  const exists = local.reduce((acc, auctionState) => {
    return acc || newAuction.tld === new Auction(auctionState).tld;
  }, false);

  if (!exists) {
    const newLocal = [...local, newAuctionState];
    newLocal.sort((a, b) => {
      const propA = new Auction(a);
      const propB = new Auction(b);

      if (propA.startTime > propB.startTime) return 1;
      if (propA.startTime < propB.startTime) return -1;
      return 0;
    });
    state.local = newLocal;
  }

  return state;
}

export const useLocalAuctions = (): AuctionState[] => {
  return useSelector((state: { auctions: State }) => {
    return state.auctions.local;
  }, (a, b) => deepEqual(a, b));
};

export const useLocalAuctionByIndex = (index: number): AuctionState | undefined => {
  return useSelector((state: { auctions: State }) => {
    return state.auctions.local[index];
  }, (a, b) => deepEqual(a, b));
};

export const useRemoteAuctions = (): AuctionState[] => {
  return useSelector((state: { auctions: State }) => {
    return state.auctions.remote;
  }, (a, b) => deepEqual(a, b));
};

export const useAuctionByTLD = (tld: string): AuctionState | null => {
  return useSelector((state: { auctions: State }) => {
    const { local, remote } = state.auctions;
    const remoteAuction = remote.find(auction => new Auction(auction).tld === tld);
    const localAuction = local.find(auction => new Auction(auction).tld === tld);

    return remoteAuction || localAuction || null;
  }, (a, b) => deepEqual(a, b));
}

export const useAuctionsUploading = (): boolean => {
  return useSelector((state: { auctions: State }) => {
    return state.auctions.uploading;
  }, (a, b) => deepEqual(a, b));
};

async function readJSON(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function fileReadCompleted() {
      resolve(JSON.parse(reader.result as string));
    };
    reader.readAsText(file);
  });
}

export function assertAuction(json: any) {
  if (!json?.params || !json?.proposals) {
    throw new Error('invalid json');
  }

  const {
    durationDays,
    endPrice,
    startPrice,
  } = json.params;

  if (typeof durationDays !== 'number') throw new Error('invalid json');
  if (typeof endPrice !== 'number') throw new Error('invalid json');
  if (typeof startPrice !== 'number') throw new Error('invalid json');

  for (const proposal of json.proposals) {
    const {
      lockTime,
      lockingOutputIdx,
      lockingTxHash,
      name,
      paymentAddr,
      price,
      publicKey,
      signature,
    } = proposal || {};
    if (typeof lockTime !== 'number') throw new Error('invalid json');
    if (typeof lockingOutputIdx !== 'number') throw new Error('invalid json');
    if (typeof lockingTxHash !== 'string') throw new Error('invalid json');
    if (typeof name !== 'string') throw new Error('invalid json');
    if (typeof paymentAddr !== 'string') throw new Error('invalid json');
    if (typeof price !== 'number') throw new Error('invalid json');
    if (typeof publicKey !== 'string') throw new Error('invalid json');
    if (typeof signature !== 'string') throw new Error('invalid json');
  }
}
