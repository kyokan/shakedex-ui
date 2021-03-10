import React, {ReactNode, useCallback, useEffect, useState} from "react";
import AppContent from "../../components/AppContent";
import Card, {CardHeader} from "../../components/Card";

import "./settings.scss";
import Input from "../../components/Input";
import Button, {ButtonType} from "../../components/Button";
import {setDevMode, updateAPI, useAPI, useDevMode} from "../../ducks/app";
import {useDispatch} from "react-redux";
import Toggle from "../../components/Toggle";
import classNames from "classnames";

export function SettingsView() {
  const dispatch = useDispatch();
  const { apiHost, apiKey } = useAPI();
  const devMode = useDevMode();
  const [adjApiHost, setAdjHost] = useState(apiHost);
  const [adjApiKey, setAdjKey] = useState(apiKey);
  const hasChanged = apiHost !== adjApiHost || apiKey !== adjApiKey;
  const isDefault = apiHost === 'https://5pi.io/hsd' && apiKey === '';

  const resetDefault = useCallback(() => {
    if (isDefault) return;
    setAdjHost('https://5pi.io/hsd');
    setAdjKey('');
  }, [isDefault]);

  const cancel = useCallback(() => {
    if (!hasChanged) return;
    setAdjHost(apiHost);
    setAdjKey(apiKey);
  }, [hasChanged, apiKey, apiHost]);

  const saveAPI = useCallback(() => {
    if (!hasChanged) return;
    dispatch(updateAPI(adjApiHost, adjApiKey));
  }, [hasChanged, adjApiHost, adjApiKey, dispatch]);

  const toggleDeveloperMode = useCallback(() => {
    dispatch(setDevMode(!devMode));
  }, [devMode]);

  useEffect(() => {
    if (!hasChanged) return;
    setAdjHost(apiHost);
    setAdjKey(apiKey);
  }, [
    apiHost,
    apiKey,
  ]);

  return (
    <AppContent className="settings">
      <div className="settings__content">
        <Card className="settings__card">
          <CardHeader title="API">

          </CardHeader>
          <div className="settings__card__content">
            <SettingGroup title="Handshake RPC Url">
              <Input
                placeholder="http://127.0.0.1:12037"
                value={adjApiHost}
                onChange={e => setAdjHost(e.target.value)}
              />
            </SettingGroup>
            <SettingGroup title="Handshake API Key">
              <Input
                placeholder="optional"
                value={adjApiKey}
                onChange={e => setAdjKey(e.target.value)}
              />
            </SettingGroup>
          </div>
          <div className="settings__actions">
            <Button
              btnType={ButtonType.secondary}
              onClick={resetDefault}
              disabled={isDefault}
            >
              Reset Default
            </Button>
            <Button
              btnType={ButtonType.secondary}
              disabled={!hasChanged}
              onClick={cancel}
            >
              Cancel
            </Button>
            <Button
              disabled={!hasChanged}
              onClick={saveAPI}
            >
              Save
            </Button>
          </div>
        </Card>

        <Card className="settings__card">
          <CardHeader title="General">

          </CardHeader>
          <div className="settings__card__content">
            <SettingGroup title="Developer Mode" horizontal>
              <Toggle
                selected={devMode}
                onClick={toggleDeveloperMode}
              />
            </SettingGroup>
          </div>
        </Card>
      </div>
    </AppContent>
  )
}

function SettingGroup(props: {
  title: string | ReactNode;
  children: string | ReactNode;
  horizontal?: boolean;
}) {
  return (
    <div
      className={classNames("settings__group", {
        'settings__group--horizontal': props.horizontal,
      })}
    >
      <div className="settings__group__label">
        {props.title}
      </div>
      <div className="settings__group__content">
        {props.children}
      </div>
    </div>
  )
}
