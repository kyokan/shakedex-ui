import React, {ReactElement, ReactNode} from "react";
import Card, {CardHeader} from "../Card";
import "./auction-info.scss";
import {useAuctionByTLD} from "../../ducks/auctions";
import {Auction} from "../../util/auction";
import moment from "moment";
import {fromDollaryDoos} from "../../util/number";

type Props = {
  tld: string;
}

export default function AuctionInfoCard(props: Props): ReactElement {
  const auctionJSON = useAuctionByTLD(props.tld);
  const auction = new Auction(auctionJSON);
  return (
    <Card className="auction-info">
      <CardHeader title="Auction Info" />
      <div className="auction-info__content">
        <div className="auction-info__content__l">
          <Group label="Initial Price">
            {`${fromDollaryDoos(auction.startPrice)} HNS`}
          </Group>
          <Group label="Reserve Price">
            {`${fromDollaryDoos(auction.endPrice)} HNS`}
          </Group>
          <Group label="Price Decrement">
            {`${fromDollaryDoos(auction.priceDecrement)} HNS / ${auction.decrementUnit}`}
          </Group>
        </div>
        <div className="auction-info__content__r">
          <Group label="Start time">
            {moment(auction.startTime).format('YYYY-MM-DD HH:mm')}
          </Group>
          <Group label="End Time">
            {moment(auction.endTime).format('YYYY-MM-DD HH:mm')}
          </Group>
        </div>
      </div>
    </Card>
  )
}

function Group(props: {label: string; children: ReactNode}) {
  return (
    <div className="auction-info__group">
      <div className="auction-info__group__label">
        {props.label}
      </div>
      <div className="auction-info__group__content">
        {props.children}
      </div>
    </div>
  )
}
