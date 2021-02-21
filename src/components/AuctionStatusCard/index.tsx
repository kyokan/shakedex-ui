import React from "react";

import Card from "../Card";

import "./auction-status.scss";

type Props = {
  tld: string;
}

export default function AuctionStatusCard(props: Props) {
  return (
    <Card className="auction-status">
      <div className="auction-status__l">
        <div className="auction-status__label">Auction Status</div>
        <div className="auction-status__value">Not Listed</div>
      </div>
      <div className="auction-status__separator" />
      <div className="auction-status__r">
        <div className="auction-status__label">Unique Views</div>
        <div className="auction-status__value">24,159</div>
      </div>
    </Card>
  );
}
