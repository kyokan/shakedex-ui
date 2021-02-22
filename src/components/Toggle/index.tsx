import React, {MouseEventHandler} from "react";
import c from "classnames";

import "./toggle.scss";

type Props = {
  selected?: boolean;
  onClick: MouseEventHandler;
};

export default function Toggle(props: Props) {
  const {
    selected = false,
    onClick,
  } = props;
  return (
    <div
      className={c('toggle', {
        'toggle--selected': selected,
      })}
      onClick={onClick}
    />
  );
}
