import "./index.scss";
import { Avatar } from "antd";
import avatar from "@/assets/images/avatar.png";
import gitee from "@/assets/images/gitee.png";
import github from "@/assets/images/github.svg";

function Profile() {
	return (
		<div className="profile">
			<Avatar className="avatar" size={100} src={avatar} />
			<span className="name">dhx</span>
			<span className="job">Web Developer</span>
			<span className="info">一个默默无闻的前端开发者</span>
			<span className="persist">君子尚拙, 以璞为真; </span>
			<span className="persist">克己慎独, 守心明性。</span>
			<div className="account">
				<a href="https://gitee.com/snow_Sharon">
					<Avatar size={32} src={gitee} />
				</a>
				<a href="https://github.com/wangxin-tian">
					<Avatar size={32} src={github} />
				</a>
			</div>
		</div>
	);
}

export default Profile;
