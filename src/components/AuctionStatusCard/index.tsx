import React from "react";

import Card from "../Card";

import "./auction-status.scss";
import {useAuctionByTLD} from "../../ducks/auctions";
import {Auction} from "../../util/auction";
import {useCurrentBlocktime} from "../../ducks/handshake";
import {useDomain} from "../../ducks/domains";

type Props = {
  tld: string;
}

export default function AuctionStatusCard(props: Props) {
  const {tld} = props;
  const auctionState = useAuctionByTLD(tld);
  const auction = auctionState && new Auction(auctionState);

  return (
    <Card className="auction-status">
      {auction && renderAuctionStatus(auction)}
      {!auction && renderDomainStatus(props)}
      <div className="auction-status__separator" />
      <div className="auction-status__r">
        <div className="auction-status__label">Unique Views</div>
        <div className="auction-status__value">-</div>
      </div>
    </Card>
  );
}

function renderDomainStatus(props: Props) {
  const domain = useDomain(props.tld);

  return (
    <div className="auction-status__l">
      <div className="auction-status__label">Domain Status</div>
      <div className="auction-status__value">{domain?.state || 'N/A'}</div>
    </div>
  );
}

function renderAuctionStatus(auction: Auction) {
  const currentBlocktime = useCurrentBlocktime();
  const statusText = auction?.getStatusText(currentBlocktime);

  return (
    <div className="auction-status__l">
      <div className="auction-status__label">Auction Status</div>
      <div className="auction-status__value">{statusText}</div>
    </div>
  );
}
