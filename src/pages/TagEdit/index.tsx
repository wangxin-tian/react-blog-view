import './index.scss';
import { useState } from "react";

import {
	useChangePageTitle,
	useGetTagListData,
	useOpenMessageThrottle,
	useShowPromiseModal,
} from "@/hook";
import { updateTag, addTag, deleteTag } from '@/request'
import { Button, Input, message } from "antd";
import MyTag from "@/component/MyTag";

function EditTag() {
	useChangePageTitle("弟皇侠のblog-标签编辑", []);
	const { tagList, setTagList } = useGetTagListData();
	const [newTag, setNewTag] = useState<Omit<Tag, "id">>({
		name: "",
		color: "#000000",
	});
	const openMessage = useOpenMessageThrottle(1000);
	const showPromiseModal = useShowPromiseModal("confirm");

	const changeOldTag = (
		item: Tag,
		target: keyof Tag,
		value: string
	) => {
		setTagList((state) => {
			item[target] = value;
			return [...state];
		});
	};

	const changeNewTag: SetStateHandleFunction<typeof newTag> = (
		target,
		value
	) => {
		setNewTag((state) => {
			state[target] = value;
			return { ...state };
		});
	};

	const submitOldTag = (item: Tag, type: "Delete" | "Edit") => {
		switch (type) {
			case "Delete":
				showPromiseModal({
					title: "删除标签",
					content: "确认提交操作？",
					onOk(...args) {
						return new Promise(async (resolve, reject) => {
							try {
                await deleteTag(item.id);
                setTagList((state) => {
                  state = state.filter((tagItem) => {
                    return tagItem.id !== item.id;
                  });
                  return [...state];
                });
                message.success('标签删除成功', 3);
							} catch (error) {
                message.warning((error as Error).message, 3);
              }
              resolve('');
						});
					},
				});
				return;
			case "Edit":
        if (item.name.trim() === '') {
          openMessage({ type: 'warning', content: '标签名不能为空' });
          return;
        }
        showPromiseModal({
          title: '编辑标签',
          content: '确认提交操作？',
          onOk(...args) {
            return new Promise(async (resolve, reject) => {
              try {
                await updateTag(item);
                message.success('标签修改成功', 3);
              } catch (error) {
                message.warning((error as Error).message, 3);
              }
              resolve('');
            })
          }
        })
				return;
		}
	};

  const submitNewTag = () => {
    if (newTag.name.trim() === '') {
      openMessage({ type: 'warning', content: '标签名不能为空' });
      return;
    }
    showPromiseModal({
      title: '创建新标签',
      content: '确认提交操作？',
      onOk(...args) {
        return new Promise(async (resolve, reject) => {
          try {
            const data = await addTag(newTag);
            setTagList((state) => {
              return [...state, data];
            });
            setNewTag({ name: '', color: '#000000' });
            message.success('标签添加成功', 3);
          } catch (error) {
            message.warning((error as Error).message, 3);
          }
          resolve('');
        })
      }
    });
  }

	return (
		<div className="edit-tag">
			<h1>标签编辑</h1>
			<div className="edit-container">
        {tagList.map((item, index) => {
          return (
            <div className="tag-item" key={item.id}>
              <Input
                placeholder="标签名称"
                size="small"
                value={item.name}
                style={{ width: '100px' }}  
                onChange={(e) => {
                  changeOldTag(item, 'name', e.target.value);
                }}
              />
              <Input
                size='small'
                type='color'
                value={item.color}
                style={{ width: '50px' }}
                onChange={(e) => {
                  changeOldTag(item, 'color', e.target.value);
                }}
              />
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  submitOldTag(item, 'Edit');
                }}
              >
                修改
              </Button>
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  submitOldTag(item, 'Delete');
                }}
              >
                删除
              </Button>
              <MyTag color={item.color}>{item.name}</MyTag>
            </div>
          );
        })}
        <div className="tag-item">
          <Input
            placeholder="标签名称"
            size="small"
            style={{ width: '100px' }}
            value={newTag.name}
            onChange={(e) => {
              changeNewTag('name', e.target.value);
            }}
          />
          <Input
            placeholder='标签颜色'
            size='small'
            type='color'
            style={{ width: '50px' }}
            value={newTag.color}
            onChange={(e) => {
              changeNewTag('color', e.target.value);
            }}
          />
          <Button type="primary" size="small" onClick={submitNewTag}>
            新增
          </Button>
          {newTag.name && <MyTag color={newTag.color}>{newTag.name}</MyTag>}
        </div>
      </div>
		</div>
	);
}

export default EditTag;
