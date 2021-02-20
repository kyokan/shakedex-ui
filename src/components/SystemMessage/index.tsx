import React, {ReactElement, ReactNode, ReactNodeArray} from "react";
import c from "classnames";

import "./system-message.scss";

export enum SystemMessageType {
  info,
  warning,
  error,
}

type Props = {
  className?: string;
  children?: ReactNode|ReactNodeArray;
  type?: SystemMessageType;
}

export default function SystemMessage(props: Props): ReactElement {
  const {
    type = SystemMessageType.info,
  } = props;

  return (
    <div
      className={c('system-message', {
        'system-message--info': type === SystemMessageType.info,
        'system-message--warning': type === SystemMessageType.warning,
        'system-message--error': type === SystemMessageType.error,
      })}
    >
      {props.children}
    </div>
  )
}
