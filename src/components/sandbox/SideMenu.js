import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";

// antd
import { Layout, Menu } from "antd";
// react-redux
import { connect } from "react-redux";
// css
import "./sidemenu.css";
import {
	UserOutlined,
	VideoCameraOutlined,
	UploadOutlined,
	MailOutlined,
	AppstoreOutlined,
	SettingOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Sider } = Layout;
const { SubMenu } = Menu;

const iconList = {
	"/home": <UserOutlined />,
	"/user-manage": <AppstoreOutlined />,
	"/user-manage/list": <MailOutlined />,
	"/right-manage": <VideoCameraOutlined />,
	"/right-manage/role/list": <UploadOutlined />,
	"/right-manage/right/list": <SettingOutlined />,
	"/news-manage/list": <VideoCameraOutlined />,
	"/news-manage": <MailOutlined />,
	"/audit-manage": <SettingOutlined />,
	"/publish-manage": <VideoCameraOutlined />,
};

function SideMenu(props) {
	// 获取用户信息 根据用户信息动态展示侧边栏内容
	const {
		role: { rights },
	} = JSON.parse(localStorage.getItem("token") || "");
	// 侧边栏内容数据
	const [menuList, setMenuList] = useState([]);
	useEffect(() => {
		axios.get("/rights?_embed=children").then((res) => {
			setMenuList(res.data);
		});
	}, []);
	// 侧边栏点击回调
	const goPath = (key) => {
		props.history.push(key);
	};
	const checkPagePermisson = (item) => {
		return item.pagepermisson === 1 && rights.includes(item.key);
	};
	// 动态渲染侧边栏内容
	const renderMenu = (menuList) => {
		return menuList.map((item) => {
			if (item.children?.length > 0 && checkPagePermisson(item)) {
				return (
					<SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
						{renderMenu(item.children)}
					</SubMenu>
				);
			}
			return (
				checkPagePermisson(item) && (
					<Menu.Item
						key={item.key}
						icon={iconList[item.key]}
						onClick={() => goPath(item.key)}
					>
						{item.title}
					</Menu.Item>
				)
			);
		});
	};
	const selectKey = [props.location.pathname];
	const openKey = ["/" + props.location.pathname.split("/")[1]];
	return (
		<Sider trigger={null} collapsible collapsed={props.isCollapsed}>
			<div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
				<div className="logo">全球新闻发布管理系统</div>
				<div style={{ height: "100%", overflow: "auto", flex: "1" }}>
					<Menu
						theme="dark"
						mode="inline"
						defaultSelectedKeys={selectKey}
						defaultOpenKeys={openKey}
					>
						{renderMenu(menuList)}
					</Menu>
				</div>
			</div>
		</Sider>
	);
}
const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => {
	return {
		isCollapsed,
	};
};
export default connect(mapStateToProps)(withRouter(SideMenu));
