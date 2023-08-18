import MyTag from "@/component/MyTag";
import { useGetTagListData } from "@/hook";
import { dot } from "@/tools";
import { Button, Skeleton } from "antd";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import './index.scss';

function TagSearch() {
	const { tagList, isLoading } = useGetTagListData();
	const tagWrapperRef = useRef<HTMLDivElement>(null);
	const [tagLinkHeight, setTagLinkHeight] = useState(0);

	const [viewMore, setViewMore] = useState(false);
	const [viewMoreBtn, setViewMoreBtn] = useState(false);

	useEffect(() => {
		const tagLink = document.querySelector<HTMLAnchorElement>(
			".tag-wrapper .tag-link"
		);
		if (tagLink) {
			setTagLinkHeight(tagLink.scrollHeight);
		}
		const tagWrapper = tagWrapperRef.current;
		const resizeObserverHandle: ResizeObserverCallback = (entries) => {
			if (!tagWrapper) return;
			const tagWrapperHeight = entries[0].contentRect.height;
			const tagWrapperScrollHeight = tagWrapper.scrollHeight;
			if (
				tagWrapperHeight &&
				tagWrapperScrollHeight &&
				tagWrapperScrollHeight - tagWrapperHeight > 10
			) {
				setViewMoreBtn(true);
			} else {
				setViewMoreBtn(false);
			}
		};
		const myObserver = new ResizeObserver(
			dot("D", resizeObserverHandle, 500)
		);
		if (tagWrapper && !viewMore) {
			myObserver.observe(tagWrapper);
		}
		return () => {
			if (tagWrapper) {
				myObserver.unobserve(tagWrapper);
			}
		};
	}, [tagList, viewMore]);

	return (
		<div className="tag-search">
			<div
				className="tag-wrapper"
				ref={tagWrapperRef}
				style={
					viewMore
						? { maxHeight: "unset", marginBottom: 0 }
						: { maxHeight: tagLinkHeight, marginBottom: 0 }
				}
			>
				{isLoading ? (
          <Skeleton active title={false} paragraph={{ rows: 1 }} />
        ) : (
          tagList.map((item) => {
            return (
              <Link
                to={`/article?kw=${item.name}`}
                key={item.id}
                className="tag-link"
              >
                <MyTag color={item.color} >{item.name}</MyTag>
              </Link>
            );
          })
        )}
			</div>
			{viewMoreBtn && !viewMore && (
				<div 
          className="view-more-wrapper"
          onClick={() => {
            setViewMore(true);
          }}>
					<Button type="link" size="small">
            查看更多
          </Button>
				</div>
			)}
		</div>
	);
}

export default TagSearch;
