import './index.scss';
import { useGetSearchArticleData } from "@/hook";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import MyCard from "../MyCard";
import { dot } from "@/tools";

function Recent() {
  const { 
    searchArticleData: {articleList},
    updateSearchArticleData
  } = useGetSearchArticleData();

  useEffect(() => {
    updateSearchArticleData({ take: 12 });
  }, [updateSearchArticleData]);

  // 宽度监听
  const recentDivRef = useRef<HTMLDivElement>(null);
  const [listShow, setListShow] = useState(false);
  const [cardListStyle, setCardListStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const recentDiv = recentDivRef.current;
    const resizeObserverHandle: ResizeObserverCallback = (entries) => {
      // 盒子宽度
      const recentDivWidth = entries[0].contentRect.width;
      let repeatCount = 1;
      if (recentDivWidth >= 600) {
        repeatCount += ~~((recentDivWidth - 600) / 300) + 1;
      }
      setCardListStyle({ gridTemplateColumns: `repeat(${repeatCount}, 1fr)`});
      if (!listShow) return setListShow(true);
    };
    const myObserver = new ResizeObserver(dot('D',resizeObserverHandle, 500));
    if (recentDiv) {
      myObserver.observe(recentDiv);
    }
    return () => {
      if (recentDiv) {
        myObserver.unobserve(recentDiv);
      }
    }
    
  }, [listShow]);

  return (
    <div className="recent" ref={recentDivRef}>
      {listShow && (
        <>
          <div className="list-tag">
            <span>最近更新</span>
            <Link className='view-more' to={'/article'}>
              查看更多
            </Link>
          </div>
          <div className={`card-list`} style={cardListStyle}>
            {articleList.map((item, index) => {
              return (
                <MyCard
                  article={item}
                  className="card-item animate__animated animate__zoomIn"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                  key={index}
                  shadow
                ></MyCard>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default Recent;