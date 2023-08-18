import myAxios from "./myAxios";

export const userLogin = async (data?: UserLoginForm): Promise<User> => {
    return await myAxios({ url: 'user/login', method: 'Post', data });
};

export const updateUserRecommendList = async (
    recommendIdList: string[],
    id: string,
): Promise<User> => {
    return await myAxios({
        url: 'user/recommendList',
        method: 'Put',
        data: { recommendIdList, id }
    });
};

export const getAllTag = async (): Promise<Tag[]> => {
    return await myAxios({ url: 'tag' });
};

export const addTag = async (data: {
    name: string;
    color: string;
}): Promise<Tag> => {
    return await myAxios({ url: 'tag', method: 'Post', data });
};

export const updateTag = async (data: {
  id: string;
  name: string;
  color: string;
}): Promise<Tag> => {
  return await myAxios({ url: 'tag', method: 'put', data })
}

export const deleteTag = async (id: string) => {
    return await myAxios({ url: 'tag', method: 'Delete', data: { id } });
}

export const getArticle = async (id: string): Promise<Article> => {
    return await myAxios({ url: `article/${id}`, method: 'Get' });
};

export const getRecommendArticleList = async (
    recommendIdList: string[],
    defaultData?: boolean,
): Promise<Article[]> => {
    return await myAxios({
        url: `article/recommendList`,
        method: 'Post',
        data: { recommendIdList, defaultData }
    });
};

export const addArticle = async (fd: FormData): Promise<Article> => {
    return await myAxios({
        url: 'article',
        method: 'Post',
        data: fd,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const updateArticle = async (fd: FormData): Promise<Article> => {
    return await myAxios({
        url: 'article',
        method: 'Put',
        data: fd,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const deleteArticle = async (
    id: string,
): Promise<{ affected: number }> => {
    return await myAxios({ url: 'article', method: 'Delete', data: { id } });
};

export const searchArticle = async (
    params?: SearchArticleParams
): Promise<SearchArticleResponseData> => {
    return await myAxios({
        url: 'article',
        method: 'Get',
        params,
    });
};

export const getImage = async (url: string) => {
    const imageSrc = (await myAxios({
        url: 'images/' +url,
        responseType: 'blob',
        timeout: 3 * 60 * 1000,
    })) as Blob;
    return imageSrc ? URL.createObjectURL(imageSrc) : '';
}