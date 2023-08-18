import { useCallback, useEffect, useState } from 'react';
import ToolBar from "./ToolBar";
import TagSearch from "./TagSearch";
import { useSearchParams } from "react-router-dom";
import { useChangePageTitle, useGetSearchArticleData } from '@/hook';
import kwStore from '@/store/kwStore';
import { Alert, Pagination, Skeleton } from 'antd';
import ArticleListItem from './ArticleListItem';
import React from 'react';
import './index.scss';

const pageSize = 10;

function ArticleList() {
  // 处理路由数据
  const [searchParams, setSearchParams] = useSearchParams();

  const getSearchParams = useCallback(
    () => {
      return {
        kw: searchParams.get('kw') || '',
        skip: Number(searchParams.get('skip') || 0) || 0,
        take: Number(searchParams.get('take') || pageSize) || pageSize,
        order: searchParams.get('order') === 'ASC' ? 'ASC' : 'DESC',
      } as Required<SearchArticleParams>
    },
    [searchParams],
  );

  const [params, setParams] = useState<SearchArticleParams>(getSearchParams());
  const {
    searchArticleData,
    updateSearchArticleData,
    isNull,
    isLoading: articleListIsLoading,
  } = useGetSearchArticleData();
  
  useEffect(() => {
    const nParams = getSearchParams();
    nParams.kw && kwStore.setKw(nParams.kw);
    setParams(nParams);
    updateSearchArticleData(nParams);
  }, [getSearchParams, searchParams, updateSearchArticleData]);

  const onChangePage = (page: number, pageSize: number) => {
    setSearchParams((state) => {
      return { ...state, ...params, skip: (page - 1) * pageSize};
    })
  };

  useChangePageTitle(
    params.kw ? `弟皇侠のblog-文章列表-${params.kw}` : '弟皇侠のblog-文章列表',
    [params.kw],
  )

  return (
    <div className="article-list">
      <ToolBar></ToolBar>
      <TagSearch></TagSearch>
      {params.kw && (
        <Alert message={`正在展示 ${params.kw} 的搜索结果`} type='info' />
      )}
      <div>
        {isNull ? (
          <Alert message={`暂无数据`} type='info' />
        ) : articleListIsLoading ? (
          <>
            {new Array(4).fill('').map((item, index) => {
              return (
                <Skeleton
                  key={index}
                  active
                  title={false}
                  paragraph={{ rows: 3 }}
                />
              );
            })}
          </>
        ) : (
          searchArticleData.articleList.map((article, index) => {
            return (
              <ArticleListItem
                key={article.id}
                article={article}
                index={index}
              />
            );
          })
        )}
      </div>
      <Pagination
        style={{ textAlign: 'right' }}
        total={searchArticleData.count}
        showTotal={ total => `total: ${total} `}
        onChange={onChangePage}
        pageSize={pageSize}
        current={~~((params.skip || 0) / pageSize) + 1}
      />
    </div>
  );
}

export default React.memo(ArticleList);
