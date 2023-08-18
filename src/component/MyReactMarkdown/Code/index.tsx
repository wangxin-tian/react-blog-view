import React from 'react';
import { CodeProps } from 'react-markdown/lib/ast-to-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark as SyntaxHighlighterStyle } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const SyntaxHighlighterMemo = React.memo(SyntaxHighlighter);

const Code = ({ node, inline, className, children, style }: CodeProps) => {
  const match = /language-(\w+)/.exec(className || '');
  return !inline && match ? (
    <SyntaxHighlighterMemo
      children={String(children).replace(/\n$/, '')}
      language={match[1]}
      PreTag='div'
      style={SyntaxHighlighterStyle}
    />
  ) : (
    <code children={children} />
  );
};

export default Code;
