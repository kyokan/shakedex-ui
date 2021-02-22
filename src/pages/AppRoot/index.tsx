import React from 'react';
import {Redirect, Route, Switch} from "react-router";

import AppHeader from "../../components/AppHeader";

import "./app.scss";
import ListingView from "../ListingVIew";
import TLDAuctionView from "../TLDAuctionView";


export default function AppRoot() {
  return (
    <div className="app">
      <AppHeader />
      <div className="app__content">
        <Switch>
          <Route
            path="/a/:tld"
            component={TLDAuctionView}
          />
          <Route
            path="/"
            component={ListingView}
          />
          <Route>
            <Redirect to="/" />
          </Route>
        </Switch>
      </div>
    </div>
  )
}

