import React, {useEffect} from "react";
import {useRouteMatch} from "react-router";
import {useDispatch} from "react-redux";

import AuctionOverview from "../../components/AuctionOverviewCard";
import AuctionStatusCard from "../../components/AuctionStatusCard";
import DomainDetailCard from "../../components/DomainDetailCard";
import {fetchDomain} from "../../ducks/domains";

import "./auction.scss";

export default function TLDAuctionView() {
  const { params } = useRouteMatch<{tld: string}>();
  const dispatch = useDispatch();
  const tld = params?.tld;

  useEffect(() => {
    dispatch(fetchDomain(tld));
  }, [tld]);

  return (
    <div className="auction">
      <AuctionOverview tld={tld} />
      <AuctionStatusCard tld={tld} />
      <DomainDetailCard tld={tld} />
    </div>
  )
}
