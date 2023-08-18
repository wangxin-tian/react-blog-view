import { CaretDownOutlined } from '@ant-design/icons';
import React from 'react';
import { PluginProps } from 'react-markdown-editor-lite';

function CollapseList(props: PluginProps) {
  const handleClick = () => {
    // 调用API，往编辑器中插入
    props.editor.insertText(
      `<details open>
  <summary>折叠列表</summary>
  <ul>
    <li>列表内容</li>
  </ul>
</details>`,
      true,
      { start: 26, end: 26 },
    );
  };

  return (
    <span
      className='button button-type-counter'
      title='折叠列表'
      onClick={handleClick}
    >
      <CaretDownOutlined />
    </span>
  );
}

CollapseList.align = 'left';
CollapseList.pluginName = 'collapse-list';

export default CollapseList;
