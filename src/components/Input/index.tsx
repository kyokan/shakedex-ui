import React, {InputHTMLAttributes, MouseEventHandler} from "react";

import "./index.scss";
import Icon from "../Icon";

type Props = {

} & InputHTMLAttributes<HTMLInputElement>;

export default function Input(props: Props) {
  return (
    <div className="input-group">
      <input
        className="input"
        {...props}
      />
    </div>
  )
}

type InputIconProps = {
  material?: string;
  url?: string;
  onIconClick?: MouseEventHandler;
} & Props;

export function InputWithIcon(props: InputIconProps) {
  const {
    material,
    url,
    size,
    onIconClick,
    ...inputProps
  } = props;
  return (
    <div className="input-group">
      <input
        className="input"
        {...inputProps}
      />
      <Icon
        material={material}
        url={url}
        size={size}
        onClick={onIconClick}
      />
    </div>
  )
}
