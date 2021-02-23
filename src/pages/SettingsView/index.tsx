import React, {ReactNode, useCallback, useState} from "react";
import AppContent from "../../components/AppContent";
import Card, {CardHeader} from "../../components/Card";

import "./settings.scss";
import Input from "../../components/Input";
import Button, {ButtonType} from "../../components/Button";
import {useAPI} from "../../ducks/app";

export function SettingsView() {
  const { apiHost, apiKey } = useAPI();
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

  return (
    <AppContent className="settings">
      <Card className="settings__card">
        <CardHeader title="API">

        </CardHeader>
        <div className="settings__content">
          <SettingGroup title="API Url">
            <Input
              placeholder="http://127.0.0.1:12037"
              value={adjApiHost}
              onChange={e => setAdjHost(e.target.value)}
            />
          </SettingGroup>
          <SettingGroup title="API Key">
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
          >
            Save
          </Button>
        </div>
      </Card>
    </AppContent>
  )
}

function SettingGroup(props: {
  title: string | ReactNode;
  children: string | ReactNode;
}) {
  return (
    <div className="settings__group">
      <div className="settings__group__label">
        {props.title}
      </div>
      <div className="settings__group__content">
        {props.children}
      </div>
    </div>
  )
}
