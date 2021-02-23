import React, {InputHTMLAttributes} from "react";

import "./index.scss";

type Props = {

} & InputHTMLAttributes<HTMLInputElement>;

export default function Input(props: Props) {
  return (
    <input
      className="input"
      {...props}
    />
  )
}
