import React, {ReactElement, useEffect, useState} from "react";
import Card, {CardHeader} from "../Card";

import "./comparables.scss";
import Toggle from "../Toggle";

type Props = {
  tld: string;
}

export default function Comparables(props: Props): ReactElement {
  const [ isShowing, setShowing ] = useState<boolean>(false);



  return (
    <Card className="comparables">
      <CardHeader title="Comparables">
        <Toggle
          onClick={() => setShowing(!isShowing)}
          selected={isShowing}
        />
      </CardHeader>
      <div className="comparables__content">
        { isShowing && <Table {...props} /> }
      </div>
    </Card>
  );
}

async function fetchComps(domain: string): Promise<{
  domain: string;
  date: string;
  price: string;
  source: string;
}[]> {
  const resp = await fetch(`https://5pi.io/namebio`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      domain: `${domain}.com`,
    }),
  });
  const comps = (await resp.json()) || [];
  return comps.filter((comp: {
    domain: string;
    date: string;
    price: string;
    source: string;
  }) => {
    return comp.domain.indexOf(domain) > -1;
  });
}

function Table(props: Props) {
  const [comps, setComps] = useState<{
    domain: string;
    date: string;
    price: string;
    source: string;
  }[]>([]);

  useEffect(() => {
    (async function() {
      const json = await fetchComps(props.tld);
      setComps(json || []);
    })();
  }, [props.tld]);

  return (
    <table>
      <thead>
      <tr>
        <td>Domain Name</td>
        <td>Date</td>
        <td>Price</td>
        <td>Source</td>
      </tr>
      </thead>
      <tbody>
      {
        comps.length > 0 && comps.map(comp => (
          <tr>
            <td>{comp.domain}</td>
            <td>{comp.date}</td>
            <td>{`$${comp.price} USD`}</td>
            <td>{comp.source}</td>
          </tr>
        ))
      }
      {
        !comps.length && (
          <div className="comparables__empty-row">
            No data to display
          </div>
        )
      }
      </tbody>
    </table>
  )
}


