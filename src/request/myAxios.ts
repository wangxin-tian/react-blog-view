import axios,{ CancelTokenSource } from "axios";
import nprogress from "nprogress";
import { requestBaseUrl } from "@/config";

const myAxios = axios.create({
    cancelToken: axios.CancelToken.source().token,
    baseURL: requestBaseUrl,
    timeout: 1 * 60 * 1000,
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    }
});

export const requestSourceMap = new Map<string, CancelTokenSource>();

myAxios.interceptors.request.use((config) => {
  const source = requestSourceMap.get(config.url || '');
  source && source.cancel();
  const newSource = axios.CancelToken.source();
  config.cancelToken = newSource.token;
  requestSourceMap.set(config.url || '', newSource);
  config.headers = config.headers || {};
  if (config.url?.substring(0, 6) === 'images') return config;
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['authorization'] = `Bearer ${token}`;
  }
  nprogress.start();
  return config;
});
myAxios.interceptors.response.use(({ data }) => {
    nprogress.done();
    if (data.error) {
        throw new Error(data.error);
    }
    return data;
},(err) => {
    nprogress.done();
    if (axios.isCancel(err)) return '';
    throw new Error(err);
});

export default myAxios;