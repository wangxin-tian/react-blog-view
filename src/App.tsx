import '@/App.scss';
import {ReactNode, Suspense, useEffect} from 'react';
import { FloatButton } from 'antd';
import MyHeader from './component/MyHeader';
import Loading from './component/Loading';
import useMyRoutes from './hook/MyRoutes';
import userStore from './store/userStore';
import { userLogin } from './request';
import { requestSourceMap } from './request/myAxios';

function App() {
  const routes = useMyRoutes();

  const changeRoute = (r: ReactNode) => {
    init();
    for(const [, source] of requestSourceMap) {
      source.cancel();
    }
    requestSourceMap.clear();
    return r;
  };

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      if (userStore.isLogin) return;

      const token = localStorage.getItem('token');
      if(!token) throw new Error('none token');
      const user = await userLogin();
      user && userStore.login(user);
    } catch (error) {
      userStore.logout();
    }
  };

  return (
    <div className="App">
      <MyHeader></MyHeader>
      <div className={'content-wrap'}>
        <Suspense fallback={<Loading>页面加载中</Loading>}>
          {changeRoute(routes)}
        </Suspense>
        <FloatButton.BackTop style={{ bottom: 20, right: 70 }} />
      </div>
    </div>
  );
}

export default App;
