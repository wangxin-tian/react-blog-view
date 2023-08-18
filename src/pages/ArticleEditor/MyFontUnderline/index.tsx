import { UnderlineOutlined } from '@ant-design/icons';
import React from 'react';
import { PluginProps } from 'react-markdown-editor-lite';

function MyFontUnderline(props: PluginProps) {
  const handleClick = () => {
    // 调用API，往编辑器中插入
    props.editor.insertText('<u></u>', true, { start: 3, end: 3 });
  };

  return (
    <span
      className='button button-type-counter'
      title='下划线'
      onClick={handleClick}
    >
      <UnderlineOutlined />
    </span>
  );
}

MyFontUnderline.align = 'left';
MyFontUnderline.pluginName = 'my-font-underline';

export default MyFontUnderline;
