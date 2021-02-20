import React from 'react';
import {Redirect, Route, Switch} from "react-router";

import AppHeader from "../../components/AppHeader";

import "./app.scss";
import ListingView from "../ListingVIew";


export default function AppRoot() {
  return (
    <div className="app">
      <AppHeader />
      <Switch>
        <Route path="/" component={ListingView} />
        <Route>
          <Redirect to="/" />
        </Route>
      </Switch>
    </div>
  )
}

