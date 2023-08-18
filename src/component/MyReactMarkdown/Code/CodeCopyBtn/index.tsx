import { CopyOutlined, LoadingOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import './index.scss';
import copy from 'copy-to-clipboard';
import { Button } from 'antd';

interface Props extends BaseProps {}

export default function CodeCopyBtn({ children }: Props) {
  const [copyOk, setCopyOk] = useState(false);

  const handleClick = async () => {
    const text = children[0].props.children[0];
    if (window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      copy(text);
    }
    setCopyOk(true);
  };

  useEffect(() => {
    if (copyOk) {
      setTimeout(() => {
        setCopyOk(false);
      }, 1000);
    }
  }, [copyOk]);

  return (
    <div className='code-copy-btn'>
      {copyOk ? (
        <Button className='copy-btn'>
          <LoadingOutlined />
        </Button>
      ) : (
        <Button className='copy-btn' onClick={handleClick}>
          <CopyOutlined />
        </Button>
      )}
    </div>
  );
}
