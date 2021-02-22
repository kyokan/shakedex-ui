import React, {ReactElement, useState} from "react";
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
        { isShowing && renderTable(props) }
      </div>
    </Card>
  );
}

function renderTable(props: Props) {
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
      <tr>
        <td>cryptocustody.com</td>
        <td>August 2020</td>
        <td>$23,250.00 USD</td>
        <td>GoDaddy auction</td>
      </tr>
      <tr>
        <td>cryptocustody.com</td>
        <td>August 2020</td>
        <td>$23,250.00 USD</td>
        <td>GoDaddy auction</td>
      </tr>
      <tr>
        <td>cryptocustody.com</td>
        <td>August 2020</td>
        <td>$23,250.00 USD</td>
        <td>GoDaddy auction</td>
      </tr>
      <tr>
        <td>cryptocustody.com</td>
        <td>August 2020</td>
        <td>$23,250.00 USD</td>
        <td>GoDaddy auction</td>
      </tr>
      <tr>
        <td>cryptocustody.com</td>
        <td>August 2020</td>
        <td>$23,250.00 USD</td>
        <td>GoDaddy auction</td>
      </tr>
      <tr>
        <td>cryptocustody.com</td>
        <td>August 2020</td>
        <td>$23,250.00 USD</td>
        <td>GoDaddy auction</td>
      </tr>
      <tr>
        <td>cryptocustody.com</td>
        <td>August 2020</td>
        <td>$23,250.00 USD</td>
        <td>GoDaddy auction</td>
      </tr>
      <tr>
        <td>cryptocustody.com</td>
        <td>August 2020</td>
        <td>$23,250.00 USD</td>
        <td>GoDaddy auction</td>
      </tr>
      <tr>
        <td>cryptocustody.com</td>
        <td>August 2020</td>
        <td>$23,250.00 USD</td>
        <td>GoDaddy auction</td>
      </tr>
      </tbody>
    </table>
  )
}


