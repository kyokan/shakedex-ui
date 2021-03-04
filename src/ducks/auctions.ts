import {Dispatch} from "redux";
import deepEqual from 'deep-equal';
import {useSelector} from "react-redux";
const jsonSchemaValidate = require('jsonschema').validate;
const { SwapProof } = require('shakedex/src/swapProof');
import {Auction} from "../util/auction";
import NodeClient from "../util/nodeclient";

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

export const uploadAuctions = (filelist: FileList | null) => async (
  dispatch: Dispatch,
  getState: () => { app: { apiHost: string; apiKey: string} },
) => {
  if (!filelist) return;
  const { app: { apiHost, apiKey } } = getState();
  const nodeClient = new NodeClient({ apiHost, apiKey });
  const files = Array.from(filelist);

  for (const file of files) {
    const json = await readJSON(file);
    await assertAuction(json, nodeClient);
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
    const ok = await proof.verify({ nodeClient });
    if (!ok) {
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
