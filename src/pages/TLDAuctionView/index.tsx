import React from "react";
import {useRouteMatch} from "react-router";

import AuctionOverview from "../../components/AuctionOverviewCard";
import AuctionStatusCard from "../../components/AuctionStatusCard";
import DomainDetailCard from "../../components/DomainDetailCard";

import "./auction.scss";

export default function TLDAuctionView() {
  const { params } = useRouteMatch<{tld: string}>();
  const tld = params?.tld;

  return (
    <div className="auction">
      <AuctionOverview tld={tld} />
      <AuctionStatusCard tld={tld} />
      <DomainDetailCard tld={tld} />
    </div>
  )
}
