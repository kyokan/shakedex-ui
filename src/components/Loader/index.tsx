import React, {ReactElement} from "react";
import "./index.scss";

type Props = {
  className?: string;
  scale?: number;
}

export function Loader(props: Props): ReactElement {
  return (
    <div
      className={`lds-roller ${props.className || ''}`}
      style={{
        transform: props.scale ? `scale(${props.scale})` : undefined,
      }}
    >
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
    </div>
  )
}
