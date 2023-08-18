type Dayjs = import('dayjs').Dayjs;

type SetStateHandleFunction<T> = <K extends keyof T>(
    target: K,
    value: T[K],
) => void;

interface BaseProps {
    children?: ReactNode;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    className?: string;
    style?: React.CSSProperties;
    key?: number | string;
}

//文章
interface Article {
    id: string;
    title: string;
    tag: Tag;
    introduction: string;
    content: string;
    imageSrc: string;
    createTime: Dayjs;
    modiTime: Dayjs;
    publicState: boolean;
}

//文章表单数据
interface ArticleForm {
    title: string;
    tagId: string;
    content: string;
    introduction: string;
    createTime: Dayjs;
    modiTime: Dayjs;
    publicState: boolean;
}

//标签
interface Tag {
    id: string;
    name: string;
    color: string;
}

//登录数据
interface UserLoginForm {
    username: string;
    password: string;
}

//用户
interface User extends UserLoginForm {
    id: string;
    recommendIdList?: string[];
    token?: string;
}

//搜索参数
interface SearchArticleParams {
    skip?: number;
    take?: number;
    kw?: string;
    order?: 'DESC' | 'ASC';
}

//搜索文章响应的数据
interface SearchArticleResponseData {
    count: number;
    articleList: Article[];
}