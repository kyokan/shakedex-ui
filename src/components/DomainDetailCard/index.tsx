import React, {ReactNode} from "react";
import copy from "copy-to-clipboard";
const {Address} = require('hsd/lib/primitives');


import "./domain-detail.scss";
import Card, {CardHeader} from "../Card";
import {useDomain} from "../../ducks/domains";
import {ellipsify} from "../../util/names";
import {formatNumber, fromDollaryDoos} from "../../util/number";
import Icon from "../Icon";
import Tooltipable from "../Tooltipable";

type Props = {
  tld: string;
}

export default function DomainDetailCard(props: Props) {
  const { tld } = props;
  const domain = useDomain(tld);
  const ownerHash = domain?.owner.hash;
  const value = domain?.value || -1;
  const valueText = value < 0 ? 'N/A' : formatNumber(fromDollaryDoos(value));
  const highest = domain?.highest || -1;
  const highestText = value < 0 ? 'N/A' : formatNumber(fromDollaryDoos(highest));
  const address = ownerHash ? Address.fromHash(Buffer.from(ownerHash, 'hex')).toString() : '';

  return (
    <Card className="domain-detail">
      <CardHeader title="Domain Info" />
      <div className="domain-detail__content">
        <Row label="Owner">
          {address ? ellipsify(address, 12, 12) : 'N/A'}
          <Tooltipable text="Copy Address">
            <Icon
              className="copy-btn"
              material="content_copy"
              size={1.5}
              onClick={() => copy(address)}
            />
          </Tooltipable>
        </Row>
        <Row label="Value">
          {`${valueText} HNS`}
        </Row>
        <Row label="Highest">
          {`${highestText} HNS`}
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
