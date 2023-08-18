import CodeCopyBtn from '@/component/MyReactMarkdown/Code/CodeCopyBtn';
import React from 'react';
import { ReactMarkdownProps } from 'react-markdown/lib/complex-types';

type PreProps = Pick<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>,
  'key' | keyof React.HTMLAttributes<HTMLPreElement>
> &
  ReactMarkdownProps;

let ref: EventTarget & HTMLPreElement;

const Pre = (preProps: PreProps) => {
  const { children } = preProps;
  return (
    <pre
      className='blog-pre'
      onTouchStart={({ currentTarget }) => {
        if (ref) ref.className = 'blog-pre';
        currentTarget.className = 'blog-pre active';
        ref = currentTarget;
      }}
    >
      <CodeCopyBtn>{children}</CodeCopyBtn>
      {children}
    </pre>
  );
};

export default Pre;
