import React, {ReactNode} from "react";
import './tooltip.scss';

type Props = {
  text: string;
  children: ReactNode;
}

export default function Tooltipable(props: Props) {
  return (
    <div className="tooltip">
      <div className="tooltip__text">
        {props.text}
      </div>
      {props.children}
    </div>
  )
}
