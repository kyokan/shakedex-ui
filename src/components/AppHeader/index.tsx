import React, {useCallback} from 'react';
import {Redirect, Route, Switch, useHistory} from "react-router";
import "./app-header.scss";
import Icon from "../Icon";
import Logo from "../../../static/assets/icons/museum.svg";

export default function AppHeader() {
  const history = useHistory();
  const goHome = useCallback(() => history.push('/'), []);

  return (
    <div className="header">
      <div className="header__content">
        <div className="header__content__l">
          <Icon
            url={Logo}
            width={32}
            onClick={goHome}
          />
        </div>
        <div className="header__content__r">

        </div>
      </div>
    </div>
  );

}

