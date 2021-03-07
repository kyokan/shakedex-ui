import {Dispatch} from "redux";
import deepEqual from 'deep-equal';
import {useSelector} from "react-redux";
const jsonSchemaValidate = require('jsonschema').validate;
const { SwapProof } = require('shakedex/src/swapProof');
import {Auction} from "../util/auction";
import NodeClient from "../util/nodeclient";

export enum ActionTypes {
  UPLOAD_AUCTIONS = 'auctions/uploadAuctions',
  UPDATE_REMOTE_TOTAL = 'auctions/updateRemoteTotal',
  ADD_LOCAL_AUCTION = 'auctions/addLocalAuction',
  ADD_REMOTE_AUCTIONS = 'auctions/addRemoteAuctions',
  DELETE_LOCAL_AUCTION = 'auctions/deleteLocalAuction',
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
  remotePage: number;
  remoteTotal: number;
  remoteStatus: true,
}

export type ProposalState = {
  lockTime: number;
  price: number;
  signature: string;
}

export type AuctionState = {
  lockingOutputIdx: number;
  lockingTxHash: string;
  name: string;
  paymentAddr: string;
  publicKey: string;
  data: ProposalState[];
}

type AuctionResponseJSON = {
  id: number;
  name: string;
  publicKey: string;
  paymentAddr: string;
  lockingTxHash: string;
  lockingOutputIdx: number;
  createdAt: number;
  updatedAt: number;
  bids: {
    price: number;
    signature: string;
    lockTime: number;
  }[];
}

const initialState = {
  uploading: false,
  local: [],
  remote: [],
  remotePage: 1,
  remoteTotal: 0,
};

export const fetchRemoteAuctions = () => async (dispatch: Dispatch, getState: () => {auctions: State}) => {
  const { auctions: {remotePage}} = getState();
  const resp = await fetch(`https://shakedex.com/api/v1/auctions?page=${remotePage}&per_page=${20}`);
  const json: {
    auctions: AuctionResponseJSON[],
    total: number,
  } = await resp.json();

  dispatch({
    type: ActionTypes.UPDATE_REMOTE_TOTAL,
    payload: json.total,
  });

  dispatch(addRemoteAuctions(json.auctions.map(auction => ({
    name: auction.name,
    lockingTxHash: auction.lockingTxHash,
    lockingOutputIdx: auction.lockingOutputIdx,
    publicKey: auction.publicKey,
    paymentAddr: auction.paymentAddr,
    data: auction.bids.map(bid => ({
      price: bid.price,
      signature: bid.signature,
      lockTime: bid.lockTime,
    })),
  }))));
};

export const addRemoteAuctions = (auctions: AuctionState[]): Action<AuctionState[]> => {
  return {
    type: ActionTypes.ADD_REMOTE_AUCTIONS,
    payload: auctions,
  };
};

export const addLocalAuction = (auction: AuctionState): Action<AuctionState> => {
  return {
    type: ActionTypes.ADD_LOCAL_AUCTION,
    payload: auction,
  };
};

export const removeLocalAuction = (tld: string): Action<string> => {
  return {
    type: ActionTypes.DELETE_LOCAL_AUCTION,
    payload: tld,
  };
};

export const uploadAuctions = (filelist: FileList | null) => async (
  dispatch: Dispatch,
  getState: () => {
    app: { apiHost: string; apiKey: string},
    auctions: State,
  },
) => {
  if (!filelist) return;
  const { app: { apiHost, apiKey }, auctions: { local } } = getState();
  const nodeClient = new NodeClient({ apiHost, apiKey });
  const files = Array.from(filelist);
  for (const file of files) {
    const json = await readJSON(file);
    await assertAuction(json, nodeClient);
    const exists = local.reduce((acc, auctionState) => {
      return acc || json.name === auctionState.name;
    }, false);

    if (exists) {
      throw new Error(`Auction for ${json.name} already exists.`);
    }

    dispatch(addLocalAuction(json as AuctionState));
  }
};

export default function auctionsReducer(state: State = initialState, action: Action<any>): State {
  switch (action.type) {
    case ActionTypes.UPDATE_REMOTE_TOTAL:
      return {
        ...state,
        remoteTotal: action.payload,
      };
    case ActionTypes.ADD_REMOTE_AUCTIONS:
      return reduceAddRemoteAuctions(state, action);
    case ActionTypes.ADD_LOCAL_AUCTION:
      return reduceAddLocalAuction(state, action);
    case ActionTypes.DELETE_LOCAL_AUCTION:
      return reduceDeleteLocalAuction(state, action);
    default:
      return state;
  }
}

function reduceDeleteLocalAuction(state: State, action: Action<string>): State {
  return {
    ...state,
    local: state.local.filter(({ name }) => name !== action.payload),
  };
}

function reduceAddRemoteAuctions(state: State, action: Action<AuctionState[]>): State {
  const { remote } = state;
  return {
    ...state,
    remote: [...remote, ...action.payload],
  }
}

function reduceAddLocalAuction(state: State, action: Action<AuctionState>): State {
  const { local } = state;
  const newAuctionState = action.payload;
  const exists = local.reduce((acc, auctionState) => {
    return acc || newAuctionState.name === auctionState.name;
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

async function readJSON(file: File): Promise<AuctionState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function fileReadCompleted() {
      resolve(JSON.parse(reader.result as string));
    };
    reader.readAsText(file);
  });
}

export async function assertAuction(auctionJSON: AuctionState, nodeClient: NodeClient) {
  const res = jsonSchemaValidate(auctionJSON, auctionSchema);

  if (!res.valid) {
    throw new Error('Invalid auction schema.');
  }

  const proofs = auctionJSON.data.map(a => new SwapProof({
    name: auctionJSON.name,
    lockingTxHash: auctionJSON.lockingTxHash,
    lockingOutputIdx: auctionJSON.lockingOutputIdx,
    publicKey: auctionJSON.publicKey,
    paymentAddr: auctionJSON.paymentAddr,
    price: a.price,
    lockTime: a.lockTime,
    signature: a.signature,
  }));

  for (const proof of proofs) {
    try {
      const ok = await proof.verify({ nodeClient });
      if (!ok) {
        throw new Error('Swap proofs failed validation.');
      }
    } catch (e) {
      console.error(e);
      throw new Error('Swap proofs failed validation.');
    }

  }
}


const hexRegex = (len: number | null) => {
  return new RegExp(`^[a-f0-9]${len ? `{${len}}` : '+'}$`);
};

const addressRegex = /^(hs|rs|ts|ss)1[a-zA-HJ-NP-Z0-9]{25,39}$/i;

const auctionSchema = {
  type: 'object',
  required: [
    'name',
    'lockingTxHash',
    'lockingOutputIdx',
    'publicKey',
    'paymentAddr',
    'data',
  ],
  properties: {
    name: {
      type: 'string',
    },
    lockingTxHash: {
      type: 'string',
      pattern: hexRegex(64),
    },
    lockingOutputIdx: {
      type: 'integer',
      minimum: 0,
    },
    publicKey: {
      type: 'string',
      pattern: hexRegex(66),
    },
    paymentAddr: {
      type: 'string',
      pattern: addressRegex,
    },
    data: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: [
          'price',
          'lockTime',
          'signature',
        ],
        properties: {
          price: {
            type: 'integer',
            minimum: 0,
          },
          lockTime: {
            type: 'integer',
            minimum: 1610000000,
          },
          signature: {
            type: 'string',
            pattern: hexRegex(130),
          },
        },
      },
    },
  },
};
