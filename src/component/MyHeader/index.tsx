import "./index.scss";
import { dot } from "@/tools";
import { useRef, useCallback, useEffect } from "react";
import MyHeaderDropdown from "./Dropdown";
import MySearch from "./Search";
import { NavLink } from "react-router-dom";

const menuList = [
	{
		title: "首页",
		url: "home",
	},
	{
		title: "文章",
		url: "article",
	},
];

let hide = false;
let scrollTop = 0;

const headerShowWithDebounce = dot(
	"D",
	(myHeader: HTMLDivElement) => {
		if (!hide) return;
		myHeader.classList.remove("hide");
		hide = false;
	},
	500
);

const scrollHandlerWithThrottle = dot(
	"T",
	(myHeader: HTMLDivElement) => {
		const newScrollTop = document.documentElement.scrollTop;
		if (
			newScrollTop < scrollTop ||
			newScrollTop < 100 ||
			scrollTop < 100
		) {
			scrollTop = newScrollTop;
			if (!hide) return;
			myHeader.classList.remove("hide");
			hide = false;
			return;
		}
		scrollTop = newScrollTop;
		headerShowWithDebounce(myHeader);
		if (hide) return;
		myHeader.classList.add("hide");
		hide = true;
	},
	100
);

function MyHead() {
	const myHeaderRef = useRef<HTMLDivElement>(null);

	const srcollHander = useCallback(() => {
		if (!myHeaderRef.current) return;
		scrollHandlerWithThrottle(myHeaderRef.current);
	}, []);

	useEffect(() => {
		document.addEventListener("scroll", srcollHander);
		return () => {
			document.addEventListener("scroll", srcollHander);
		};
	}, [srcollHander]);

	return (
		<div className="my-header" ref={myHeaderRef}>
			<div className="container">
				<div className="left-wrapper">
					<div className="logo">弟皇侠のBlog</div>
					<div className="menu">
						{menuList.map((item, index) => {
							return (
								<NavLink
									key={index}
									to={item.url}
									className={({ isActive }) =>
										isActive ? "myActive" : ""
									}
								>
									{item.title}
								</NavLink>
							);
						})}
					</div>
				</div>
				<MyHeaderDropdown></MyHeaderDropdown>
				<MySearch className="small-screen-hide"></MySearch>
			</div>
		</div>
	);
}

export default MyHead;
