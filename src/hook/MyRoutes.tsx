import LoginGuard from "@/component/LoginGuard";
import { lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";

const Home = lazy(() => import("@/pages/Home"));
const ArticleList = lazy(() => import("@/pages/ArticleList"));
const TagEdit = lazy(() => import("@/pages/TagEdit"));
const ArticleEditor = lazy(() => import('@/pages/ArticleEditor'));
const ArticleRecommendEdit = lazy(() => import('@/pages/ArticleRecommendEdit'));
const ArticleDetail = lazy(() => import('@/pages/ArticleDetail'));

const useMyRoutes = function () {
	const routes = useRoutes([
		{
			path: "home",
			element: <Home />,
		},
		{
			path: "article",
			element: <ArticleList />,
		},
		{
			path: "article/editTag",
			element: (
				<LoginGuard>
					<TagEdit></TagEdit>
				</LoginGuard>
			),
		},
		{
		  path: 'article/addArticle',
		  element: (
		    <LoginGuard>
		      <ArticleEditor></ArticleEditor>
		    </LoginGuard>
		  ),
		},
		{
		  path: 'article/editRecommend',
		  element: (
		    <LoginGuard>
		      <ArticleRecommendEdit></ArticleRecommendEdit>
		    </LoginGuard>
		  ),
		},
		{
		  path: 'article/:id',
		  element: <ArticleDetail />,
		},
		// {
		//   path: 'discuss',
		//   element: <Discuss />,
		// },
		{ path: "*", element: <Navigate to={"home"} replace /> },
	]);

	return routes;
};

export default useMyRoutes;
