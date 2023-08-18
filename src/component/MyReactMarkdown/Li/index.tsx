import React from 'react';
import { LiProps } from 'react-markdown/lib/ast-to-react';

function Li({ node, className, children, style, ordered }: LiProps) {
  if (!children || children.length === 0) return <li>{children}</li>;
  for (let i = 0; i < children.length; i++) {
    let item = children[i];
    if (!item || typeof item !== 'string' || item === '\n') continue;
    const strArr = (item as string).split('\n');
    const len = strArr.length;
    const elementArr: React.ReactNode[] = [];
    for (let i = 0; i < len; i++) {
      elementArr.push(strArr[i]);
      if (i < len - 1) {
        elementArr.push(<br />);
      }
    }
    children[i] = elementArr;
  }
  return <li>{children}</li>;
}

export default Li;
