import './index.scss';
import Profile from "@/component/Profile";
import Recommend from "@/component/Recommend";
import Recent from "@/component/Recent";
import { useChangePageTitle } from "@/hook";

function Home() {
  useChangePageTitle('首页', []);
  return (
    <div className="home-container">
      <div className="left small-screen-hide">
        <Profile></Profile>
      </div>
      <div className="right">
        <Recommend></Recommend>
        <Recent></Recent>
      </div>
    </div>
  );
}

export default Home;