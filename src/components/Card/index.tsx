import React, {ReactNode, ReactNodeArray} from "react";
import c from "classnames";

import "./card.scss";

type Props = {
  className?: string;
  children?: ReactNode | ReactNodeArray;
}

export default function Card(props: Props) {
  const { className = '' } = props;

  return (
    <div className={c('card', className)}>
      {props.children}
    </div>
  );
}

type CardHeaderProps = {
  title: string | ReactNode;
  children?: ReactNode | ReactNodeArray;
}

export function CardHeader(props: CardHeaderProps) {
  const {
    title,
    children,
  } = props;

  return (
    <div className="card__header">
      <div className="card__header__title">
        {title}
      </div>
      <div className="card__header__actions">
        {children}
      </div>
    </div>
  )
}
