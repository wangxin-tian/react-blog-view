import { useChangePageTitle, useGetRecommendArticleList, useOpenMessageThrottle, useShowPromiseModal } from "@/hook";
import { updateUserRecommendList } from "@/request";
import userStore from "@/store/userStore";
import { dot } from "@/tools";
import { DeleteOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { Alert, Button } from "antd";
import { useEffect } from 'react';
import { DragDropContext, Draggable, DropResult, Droppable } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";
import './index.scss';

function ArticleRecommendEdit() {
  useChangePageTitle('弟皇侠のblog-精选编辑', []);
  const { articleList, setArticleList, updateRecommendArticleList } =
    useGetRecommendArticleList();
  
  useEffect(() => {
    updateRecommendArticleList(userStore.user.recommendIdList || []);
  }, [updateRecommendArticleList])
  
  const navigate = useNavigate();

  const onDragEnd = (result: DropResult) => {
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination?.index || 0;
    if (sourceIndex === destinationIndex) {
      return;
    }
    setArticleList((state) => {
      const [draggedItem] = state.splice(sourceIndex, 1);
      state.splice(destinationIndex, 0, draggedItem);
      return [...state];
    })
  }

  const showPromiseModal = useShowPromiseModal('confirm');

  const deleteArticle = (article: Article) => {
    showPromiseModal({
      title: '删除精选推荐',
      content: '确认提交操作？',
      onOk(...args) {
        setArticleList((state) => {
          const nState = state.filter((item) => {
            return item.id !== article.id;
          });
          return [...nState];
        })
      }
    });
  };

  const openMessage = useOpenMessageThrottle(1000, {
    type: 'success',
  });

  const submit = dot('T',async () => {
    showPromiseModal({
      title: '修改精选推荐',
      content: '确认提交操作？',
      async onOk(...args) {
        const recommendIdList = articleList.map((item) => {
          return item.id;
        });
        const user = await updateUserRecommendList(
          recommendIdList,
          userStore.user.id,
        );
        userStore.login(user);
        openMessage({
          content: '精选推荐编辑成功',
        });
        navigate('/article');
      },
    });
  }, 1000);

  return (
    <div className="article-recommend-edit">
      <h1>精选编辑</h1>
      {userStore.user.recommendIdList?.length ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="my-modal">
            <div className="modal-item modal-head">
              <span
                style={{ flexBasis: 'var(--Font-Size-Title-Large)' }}
              ></span>
              <span style={{ flex: '3' }}>标题</span>
              <span style={{ flex: '6' }}>简介</span>
              <span className="small-screen-hide" style={{ flex: '1' }}>
                标签
              </span>
              <span className="small-screen-hide" style={{ flexBasis: '80px' }}>
                发表日期
              </span>
              <span
                style={{
                  flexBasis: 'var(--Font-Size-Title-Large)',
                }}
              />
            </div>
            <Droppable droppableId="my-modal" direction="vertical">
              {(provided) => (
                <div 
                  className="modal-list"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {articleList.map((item, index) => (
                    <Draggable
                      draggableId={item.id}
                      index={index}
                      key={item.id}
                    >
                      {(provided) => (
                        <div 
                        className="modal-item"
                        key={item.id}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <UnorderedListOutlined
                          style={{
                            flexBasis: 'var(--Font-Size-Title-Large)',
                            fontSize: 'var(--Font-Size-Title-Small)',
                          }}
                        />
                        <span style={{ flex: '3' }}>{item.title}</span>
                        <span style={{ flex: '6' }}>{item.introduction}</span>
                        <span
                          className="small-screen-hide"
                          style={{ flex: '1' }}
                        >
                          {item.tag.name}
                        </span>
                        <span
                          className="small-screen-hide"
                          style={{ flexBasis: '80px' }}
                        >
                          {item.createTime.format('YYYY--MM-DD')}
                        </span>
                        <DeleteOutlined
                          style={{
                            flexBasis: 'var(--Font-Size-Title-Large)',
                            fontSize: 'var(--Font-Size-Title-Small)',
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            deleteArticle(item);
                          }}
                        />
                      </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <Button
              style={{ textAlign: 'left' }}
              type="primary"
              onClick={submit}
            >
              修改
            </Button>
          </div>
        </DragDropContext>
      ) : (
        <Alert message={'暂无数据'} type="info" />
      )}
    </div>
  );
}

export default ArticleRecommendEdit;