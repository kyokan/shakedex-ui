import {AuctionState, ProposalState} from "../ducks/auctions";
import moment from "moment";

type AuctionStatus = 'LISTED' | 'STARTED' | 'ENDED';

export class Auction {
  tld: string;

  durationDays: number;

  endPrice: number;

  startPrice: number;

  startTime: Date;

  endTime: Date;

  proposals: ProposalState[];

  priceDecrement: number;

  decrementUnit: '1d' | '3h' | '1h' | '';

  constructor(options: AuctionState) {
    this.tld = options.proposals[0]?.name;
    this.durationDays = options.params.durationDays;
    this.endPrice = options.params.endPrice;
    this.startPrice = options.params.startPrice;
    this.proposals = options.proposals;
    this.startTime = new Date(options.proposals[0]?.lockTime * 1000);
    this.endTime = new Date(options.proposals[options.proposals.length - 1]?.lockTime * 1000);
    this.priceDecrement = Math.abs(options.proposals[1]?.price - this.startPrice);

    switch ((options.proposals[1]?.lockTime - options.proposals[0]?.lockTime) / 3600) {
      case 24:
        this.decrementUnit = '1d';
        break;
      case 3:
        this.decrementUnit = '3h';
        break;
      case 1:
        this.decrementUnit = '1h';
        break;
      default:
        this.decrementUnit = '';
        break;
    }
  }

  getStatus(blockTime: Date): AuctionStatus {
    const startTime = moment(this.startTime);
    const endTime = moment(this.endTime);
    const currentTime = moment(blockTime);

    if (currentTime.isBefore(startTime)) {
      return 'LISTED';
    } else if (currentTime.isAfter(startTime) && currentTime.isBefore(endTime)) {
      return 'STARTED';
    } else {
      return 'ENDED';
    }
  }

  getPrice(blocktime: Date): number {
    let price = this.proposals[0]?.price;
    const currentTime = moment(blocktime);

    for (const proposal of this.proposals) {
      const proposalTime = moment(proposal.lockTime * 1000);
      if (currentTime.isAfter(proposalTime)) {
        price = proposal.price;
      }
    }

    return price;
  }
}
