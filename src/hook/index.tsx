import { articleDateInit, dot } from "@/tools";
import { Modal, message, ModalFuncProps } from "antd";
import { ArgsProps } from "antd/es/message/interface";
import { useCallback, useEffect, useState } from "react";
import PubSub from "pubsub-js";
import {
	getAllTag,
	getArticle,
	getImage,
	getRecommendArticleList,
	searchArticle,
} from "@/request";

export const useOpenMessageThrottle = (
	delay = 1000,
	defaultConfig?: Partial<ArgsProps>
) => {
	const throttleFn = dot(
		"T",
		function (config: ArgsProps) {
			message.open({ ...defaultConfig, ...config });
		},
		delay
	);

	const openMessage: (config: ArgsProps) => any = useCallback(
		throttleFn,
		[throttleFn]
	);

	return openMessage;
};

export const useShowPromiseModal = (
	type: ModalFuncProps["type"] = "info"
) => {
	const target = Modal[type];

	const ShowPromiseModal = (config?: ModalFuncProps) => {
		target({
			title: "标题",
			content: "内容",
			okText: "确认",
			cancelText: "取消",
			...config,
		});
	};

	return ShowPromiseModal;
};

export const useGetTagListData = () => {
	const [tagList, setTagList] = useState<Tag[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		getTagListData();
	}, []);

	const getTagListData = async () => {
		setIsLoading(true);
		const data = await getAllTag();
		setIsLoading(false);
		setTagList(data);
	};

	return { tagList, setTagList, isLoading };
};

export const useGetSearchArticleData = () => {
	const [searchArticleData, setSearchArticleData] =
		useState<SearchArticleResponseData>({
			count: 0,
			articleList: [],
		});
	const [isLoading, setIsLoading] = useState(false);
	const [isNull, setIsNull] = useState(false);

	const updateSearchArticleData = useCallback(
		async (params?: SearchArticleParams) => {
			try {
				setIsLoading(true);
				setIsNull(false);
				const res = await searchArticle(params);
				setIsLoading(false);
				!res.articleList.length && setIsNull(true);
				res.articleList = res.articleList.map((item) => {
					return articleDateInit(item);
				});
				setSearchArticleData(res);
				return res;
			} catch (err) {}
		},
		[]
	);

	return {
		searchArticleData,
		setSearchArticleData,
		updateSearchArticleData,
		isLoading,
		isNull,
	};
};

export const useGetArticleDetail = () => {
	const [articleDetail, setArticleDetail] = useState<Article>();
	const [error, setError] = useState("");

	const imageSrc = useRequestImage(articleDetail);

	const updateArticleDetail = useCallback(async (id: string) => {
		try {
			setError("");
			const res = await getArticle(id);
			setArticleDetail(articleDateInit(res));
			return res;
		} catch (error) {
			setError((error as Error).message);
		}
	}, []);

	return {
		articleDetail,
		setArticleDetail,
		updateArticleDetail,
		error,
		imageSrc,
	};
};

export const useGetRecommendArticleList = () => {
	const [articleList, setArticleList] = useState<Article[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const updateRecommendArticleList = useCallback(
		async (recomendIdList: string[], defaultData?: boolean) => {
			try {
				setIsLoading(true);
				let res = await getRecommendArticleList(
					recomendIdList,
					defaultData
				);
				setIsLoading(false);
				res = res.map((item) => {
					return articleDateInit(item);
				});
				setArticleList(res);
				return res;
			} catch (error) {}
		},
		[]
	);

	return {
		articleList,
		setArticleList,
		updateRecommendArticleList,
		isLoading,
	};
};

export const useRequestImage = (article?: Article) => {
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    if (!article) return ;
    const id = article.id;
    PubSub.subscribe(id, function (_, data) {
      setImageSrc(data);
    });
    const requestImage = async () => {
      const imageSrc = await getImage(article.imageSrc);
      imageSrc && PubSub.publish(id, imageSrc);
    };
    requestImage();
    return () => {
      PubSub.unsubscribe(id);
    };
  }, [article]);

  return imageSrc;
};

export const useChangePageTitle = (
  title: string,
  deps: React.DependencyList | undefined = []
) => {
  useEffect(() => {
    document.title = title;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};  // 注释eslint-disable-next-line react-hooks/exhaustive-deps的作用是禁用ESLint规则react-hooks/exhaustive-deps对该行代码的检查
