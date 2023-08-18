import { Tag, TagProps } from "antd";
import './index.scss';

interface Props extends BaseProps{
  color: string;
  tagProps?: TagProps;
  hidePoint?: boolean;
}

function MyTag(props: Props) {

  return (
    <Tag
      {...props.tagProps}
      className={`my-tag ${props.className || ''}`}
      style={props.style}
    >
      {!props.hidePoint && (
        <span style={{ backgroundColor: props.color }}  className="point" ></span>
      )}
      {props.children}
    </Tag>
  );
}

export default MyTag;