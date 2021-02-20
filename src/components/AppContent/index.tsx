import React, {ReactElement, ReactNode, ReactNodeArray} from "react";
import c from "classnames";
import "./app-content.scss";

type Props = {
  className?: string;
  children?: ReactNode|ReactNodeArray;
}

export default function AppContent(props: Props): ReactElement {
  return (
    <div className={c('app-content', props.className)}>
      {props.children}
    </div>
  )
}
