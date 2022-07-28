// @ts-nocheck
import React, { useEffect } from "react";
import NewsRouter from "../../components/sandbox/NewsRouter";
import Nprogress from "nprogress";
import "nprogress/nprogress.css";
// css
import "./NewsSandBox.css";

// 组件
import TopHeader from "../../components/sandbox/TopHeader";
import SideMenu from "../../components/sandbox/SideMenu";

// antd
import { Layout } from "antd";
const { Content } = Layout;

export default function NewsSandBox() {
	Nprogress.start();
	useEffect(() => {
		Nprogress.done();
	});
	return (
		<Layout>
			<SideMenu></SideMenu>
			<Layout className="site-layout">
				<TopHeader></TopHeader>
				<Content
					className="site-layout-background"
					style={{
						margin: "24px 16px",
						padding: 24,
						minHeight: 280,
					}}
				>
					<NewsRouter></NewsRouter>
				</Content>
			</Layout>
		</Layout>
	);
}
