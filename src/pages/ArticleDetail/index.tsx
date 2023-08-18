import { useChangePageTitle, useGetArticleDetail, useOpenMessageThrottle, useShowPromiseModal } from "@/hook";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { deleteArticle, updateUserRecommendList } from "@/request";
import userStore from "@/store/userStore";
import { CalendarOutlined, DeleteOutlined, EditOutlined, MenuOutlined, StarOutlined, TagOutlined } from "@ant-design/icons";
import defaultImage from '@/assets/images/default.png'
import { Drawer, FloatButton, Image, Skeleton } from "antd";
import Loading from "@/component/Loading";
import MarkNav from "markdown-navbar";
import MyReactMarkdown from "@/component/MyReactMarkdown";
import './index.scss';

function ArticleDetail() {

  const params = useParams();

  const openMessage = useOpenMessageThrottle(1000);
  const navigate = useNavigate();

  const { articleDetail, updateArticleDetail, error, imageSrc } = 
    useGetArticleDetail();
  useEffect(() => {
    updateArticleDetail(params?.id || '');
    const hash = window.location.hash.slice(1);
    if (hash) {
      showDrawer();
    } else {
      document.documentElement.scrollTop = 0;
    }
  }, [params?.id, updateArticleDetail]);

  useChangePageTitle(
    articleDetail?.title
      ? '弟皇侠のblog-文章详情-' + articleDetail.title
      : '弟皇侠のblog-文章详情-加载中',
    [articleDetail?.title],
  );

  useEffect(() => {
    if (error) {
      openMessage({
        content: error,
        type: 'error',
      });
      navigate('/article');
    }
  }, [error, openMessage, navigate]);

  //抽屉
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  //文章修改、删除
  const ShowPromiseModal = useShowPromiseModal('confirm');

  const articleEditHandle = () => {
    ShowPromiseModal({
      title: '编辑文章',
      content: '是否编辑',
      onOk(...args) {
        navigate(`/article/addArticle?id=${params?.id || ''}`);
      },
    });
  };

  const articleDeleteHandle = () => {
    ShowPromiseModal({
      title: '删除文章',
      content: '确认删除文章',
      async onOk(...args) {
          try {
            const {affected} = await deleteArticle(params?.id || '');
            if (affected) {
              openMessage({
                content: '删除成功',
                type: 'success',
              });
            } else {
              openMessage({
                content: '删除失败',
                type: 'error',
              });
            }
          } catch (error) {
            openMessage({
              content: (error as Error).message,
              type: 'warning',
            });
          } finally {
            navigate('/article');
          }
      },
    });
  }

  const articleStarHandle = () => {
    const recommendIdList = userStore.user.recommendIdList || [];
    if (recommendIdList.includes(params?.id || '')) {
      openMessage({
        content: '已经是精选推荐了',
        type: 'warning',
      });
      return;
    }
    ShowPromiseModal({
      title: '添加精选推荐',
      content: '精选推荐将会在首页展示，是否添加',
      async onOk(...args) {
          try {
            const user = await updateUserRecommendList(
              [...recommendIdList, params?.id || ''],
              userStore.user.id,
            );
            userStore.login(user);
            openMessage({
              content: '精选推荐添加成功',
              type: 'success',
            })
          } catch (error) {
            openMessage({
              content: (error as Error).message,
              type: 'warning',
            });
          }
      },
    })
  }

  return (
    <div className="article-detail" id="article-detail">
      {articleDetail ? (
        <>
        <h1>{articleDetail.title}</h1>
        <div className="info">
          <span>
              <CalendarOutlined />
              {articleDetail.createTime.format('YYYY年MM月DD日')}
            </span>
            <span>
              <EditOutlined />
              {articleDetail.modiTime.format('YYYY年MM月DD日')}
            </span>
            <Link
              to={{
                pathname: '/article',
                search: `kw=${articleDetail.tag.name}`
              }}
            >
              <TagOutlined/>
            {articleDetail.tag.name}
          </Link>
        </div>
        <Image
          src={imageSrc}
          alt={articleDetail.title}
          title={articleDetail.title}
          fallback={defaultImage}
          loading='lazy'
        />
        <div className="introduction">
          <span>{articleDetail.introduction}</span>
        </div>
        <MyReactMarkdown markdown={articleDetail.content}></MyReactMarkdown>
        </>
      ) : (
        <>
          <Loading>请求数据中...</Loading>
          <Skeleton active title={false} paragraph={{ rows: 1 }} />
          <Skeleton.Avatar
            shape={'square'}
            style={{
              width: '100%',
              height: '0',
              paddingBottom: `${900 / 16}`
            }}
            active
          />
          <Skeleton active title={false} paragraph={{ rows: 1 }} />
          <Skeleton active title={false} paragraph={{ rows: 8 }} />
        </>
      )}
      <Drawer
        width={'min(378px,70%)'}
        title='目录'
        placement='right'
        onClose={onClose}
        open={open}
        closable={false}
        getContainer={() => {
          return document.getElementById('article-detail')!;
        }}
      >
        <MarkNav
          className="article-menu"
          source={'\n' + articleDetail?.content}
          ordered={true}
          updateHashAuto={true}
          declarative={true}
          headingTopOffset={60}
        />
      </Drawer>
      {articleDetail && (
        <>
          {userStore.isLogin && (
            <>
              <FloatButton
                onClick={articleEditHandle}
                style={{ right: 20, bottom: 170 }}
                icon={<EditOutlined/>}
              />
              <FloatButton
                onClick={articleDeleteHandle}
                style={{ right: 20, bottom: 120 }}
                icon={<DeleteOutlined />}
              />
              <FloatButton
                onClick={articleStarHandle}
                style={{ right: 20, bottom: 70 }}
                icon={<StarOutlined />}
              />
            </>
          )}
          <FloatButton
            onClick={showDrawer}
            style={{ right: 20, bottom: 20 }}
            icon={<MenuOutlined />}
          />
        </>
      )}
    </div>
  );
}

export default ArticleDetail;