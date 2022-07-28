import React from "react";
// antd
import { Layout, Menu, Dropdown, Avatar } from "antd";
import {
	MenuUnfoldOutlined,
	MenuFoldOutlined,
	DownOutlined,
} from "@ant-design/icons";
// router
import { withRouter } from "react-router-dom";
// react-redux
import { connect } from "react-redux";
const { Header } = Layout;

function TopHeader(props) {
	const changeCollapsed = () => {
		// 改变state状态
		props.changeCollapsed();
	};
	// 解构本地存储的用户信息
	const {
		role: { roleName },
		username,
	} = JSON.parse(localStorage.getItem("token") || "");
	const menu = (
		<Menu>
			<Menu.Item icon={<DownOutlined key="1" />}>{roleName}</Menu.Item>
			<Menu.Item
				danger
				key="2"
				onClick={() => {
					localStorage.removeItem("token");
					props.history.replace("/login");
				}}
			>
				退出
			</Menu.Item>
		</Menu>
	);
				
	return (
		<Header className="site-layout-background" style={{ padding: "0 16px" }}>
			{props.isCollapsed ? (
				<MenuUnfoldOutlined onClick={changeCollapsed}></MenuUnfoldOutlined>
			) : (
				<MenuFoldOutlined onClick={changeCollapsed}></MenuFoldOutlined>
			)}
			<div style={{ float: "right" }}>
				<span>
					欢迎 <i style={{ color: "#1890ff" }}>{username}</i> 回来！
				</span>
				{/* @ts-ignore */}
				<Dropdown overlay={menu}>
					{<Avatar src="https://joeschmoe.io/api/v1/random" />}
				</Dropdown>
			</div>
		</Header>
	);
}
const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => {
	return {
		isCollapsed,
	};
};
const mapDispatchToProps = {
	changeCollapsed() {
		return {
			type: "change-collapsed",
		};
	},
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(TopHeader));
