import React, {useCallback} from 'react';
import {useHistory} from "react-router";
import Icon from "../Icon";
import Logo from "../../../static/assets/icons/museum.svg";

import "./app-header.scss";


export default function AppHeader() {
  const history = useHistory();
  const goHome = useCallback(() => history.push('/'), []);
  const goSetting = useCallback(() => history.push('/settings'), []);

  return (
    <div className="header">
      <div className="header__content">
        <div className="header__content__l">
          <Icon
            url={Logo}
            size={2.25}
            onClick={goHome}
          />
        </div>
        <div className="header__content__r">
          <Icon
            className="setting-icon"
            material="settings"
            size={2.25}
            onClick={goSetting}
          />
        </div>
      </div>
    </div>
  );

}

