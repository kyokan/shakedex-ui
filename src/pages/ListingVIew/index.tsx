import React, {ChangeEvent, ReactElement, useCallback} from "react";
import {useDispatch} from "react-redux";

import AppContent from "../../components/AppContent";
import SystemMessage, {SystemMessageType} from "../../components/SystemMessage";
import Button from "../../components/Button";
import {uploadAuctions, useLocalAuctionByIndex, useLocalAuctions, useRemoteAuctions} from "../../ducks/auctions";
import Card, {CardHeader} from "../../components/Card";

import "./listing-view.scss";
import {Auction} from "../../util/auction";
import {useHistory} from "react-router";
import {useCurrentBlocktime, useHandshakeInfo} from "../../ducks/handshake";
import moment from "moment";
import {formatNumber, fromDollaryDoos} from "../../util/number";


export default function ListingView() {
  const localAuctions = useLocalAuctions();
  const remoteAuctions = useRemoteAuctions();
  const noAuctions = !localAuctions.length && !remoteAuctions.length;


  return (
    <AppContent className="listing-view">
      <SystemMessage type={SystemMessageType.error}>
        <div>ShakeDex API is currently unavailable 😵</div>
        <div>You may still manually upload presigns to view and fulfill auction.</div>
      </SystemMessage>
      <div className="listing-view__content">
        <LocalAuctions />
        { noAuctions && <NoListing /> }
      </div>
    </AppContent>
  )
}

function LocalAuctions(): ReactElement {
  const localAuctions = useLocalAuctions();
  const history = useHistory();
  const currentTime = useCurrentBlocktime();

  if (!localAuctions.length) return <></>;

  return (
    <Card className="local-auctions">
      <CardHeader title="Local Auctions" />
      <div className="local-auctions__content">
        <table>
          <thead>
            <tr>
              <td>Domain Name</td>
              <td>Status</td>
              <td>Price (HNS)</td>
              <td>Price Decrement</td>
            </tr>
          </thead>
          <tbody>
            {
              localAuctions.map((auctionOption, i) => {
                const auction = new Auction(auctionOption);

                return (
                  <LocalAuctionRow
                    key={`${auction.tld}-${auction.startTime}=${auction.priceDecrement}`}
                    auctionIndex={i}
                  />
                );
              })
            }
          </tbody>
        </table>
      </div>
    </Card>

  )
}

function LocalAuctionRow(props: { auctionIndex: number }) {
  const auctionOption = useLocalAuctionByIndex(props.auctionIndex);
  const currentTime = useCurrentBlocktime();
  const history = useHistory();

  if (!auctionOption) return <></>;

  const auction = new Auction(auctionOption);

  const status = auction.getStatus(currentTime);
  const price = auction.getPrice(currentTime);

  return (
    <tr
      key={auction.tld + auction.durationDays + auction.startPrice + auction.startTime}
      onClick={() => history.push(`/a/${auction.tld}`)}
    >
      <td>{auction.proposals[0]?.name}</td>
      <td>{status}</td>
      <td>{formatNumber(fromDollaryDoos(price))}</td>
      <td>{formatNumber(fromDollaryDoos(auction.priceDecrement)) + ` / ${auction.decrementUnit}`}</td>
    </tr>
  );
}

function NoListing() {
  const dispatch = useDispatch();

  const onFileUpload = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    dispatch(uploadAuctions(e.target.files));
  }, []);

  return (
    <Button className="upload-auction-btn">
      Upload Presigns
      <input
        type="file"
        accept="application/json"
        onChange={onFileUpload}
        multiple
      />
    </Button>
  )
}
