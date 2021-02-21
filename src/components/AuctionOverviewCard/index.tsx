import React from "react";
import c from "classnames";
import copy from "copy-to-clipboard";

import Tooltipable from "../Tooltipable";
import Icon from "../Icon";
import Card from "../Card";

import "./auction-overview.scss";

type Props = {
  tld: string;
}

export default function AuctionOverview(props: Props) {
  const {
    tld,
  } = props;

  const bookmarked = false;

  return (
    <Card className="auction-overview">
      <div className="auction-overview__l">
        <Tooltipable text="Bookmark">
          <Icon
            className={c("auction-overview__fav-icon", {
              'auction-overview__fav-icon--bookmarked': bookmarked,
            })}
            material={bookmarked ? 'favorite' : 'favorite_border'}
            size={2.25}
            onClick={() => null}
          />
        </Tooltipable>
        <div className="auction-overview__name">
          {tld}
        </div>
      </div>
      <div className="auction-overview__r">
        <Tooltipable text="Copy URL">
          <Icon
            material="link"
            size={2.25}
            onClick={() => copy(window.location.href)}
          />
        </Tooltipable>
      </div>
    </Card>
  );
}
