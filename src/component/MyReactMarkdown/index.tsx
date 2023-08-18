import React from 'react';
import './index.scss';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import Pre from './Pre';
import Code from './Code';
import Li from './Li';

interface Props extends BaseProps {
  markdown: string;
}

function MyReactMarkdown(props: Props) {
  return (
    <div className={`my-react-markdown ${props.className || ''}`}>
      <ReactMarkdown
        linkTarget={'_blank'}
        skipHtml={true}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          pre: Pre,
          code: Code,
          li: Li,
        }}
      >
        {props.markdown}
      </ReactMarkdown>
    </div>
  );
}

export default MyReactMarkdown;
