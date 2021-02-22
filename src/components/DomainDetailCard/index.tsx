import React, {ReactNode} from "react";
const {Address} = require('hsd/lib/primitives');

import "./domain-detail.scss";
import Card, {CardHeader} from "../Card";
import {useDomain} from "../../ducks/domains";
import {ellipsify} from "../../util/names";

type Props = {
  tld: string;
}

export default function DomainDetailCard(props: Props) {
  const { tld } = props;
  const domain = useDomain(tld);
  const ownerHash = domain?.owner.hash;
  const address = ownerHash ? Address.fromHash(Buffer.from(ownerHash, 'hex')).toString() : '';

  return (
    <Card className="domain-detail">
      <CardHeader title="Domain Info" />
      <div className="domain-detail__content">
        <Row label="Owner">
          {address ? ellipsify(address, 8, 8) : 'N/A'}
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
