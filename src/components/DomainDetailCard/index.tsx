import React, {ReactNode} from "react";

import "./domain-detail.scss";
import Card, {CardHeader} from "../Card";

type Props = {
  tld: string;
}

export default function DomainDetailCard(props: Props) {
  return (
    <Card className="domain-detail">
      <CardHeader title="Domain Info" />
      <div className="domain-detail__content">
        <Row label="Owner">

        </Row>
        <Row label="Email">

        </Row>
        <Row label="Social">

        </Row>
      </div>
    </Card>
  );
}

type RowProps = {
  label: string;
  children: ReactNode;
}

function Row(props: RowProps) {
  return (
    <div className="domain-detail__content__row">
      <div className="domain-detail__content__row__label">
        {props.label}
      </div>
      <div className="domain-detail__content__row__value">
        {props.children || "N/A"}
      </div>
    </div>
  )
}
