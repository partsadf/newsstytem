import React, { useEffect, useRef, useState } from "react";
import { Card, Col, Row, List, Avatar, Drawer } from "antd";
import * as echarts from "echarts";
import {
	EditOutlined,
	EllipsisOutlined,
	FullscreenOutlined,
} from "@ant-design/icons";
import axios from "axios";
const { Meta } = Card;
export default function Index() {
	const [viewList, setviewList] = useState([]);
	const [starList, setstarList] = useState([]);
	const [visible, setvisible] = useState(false);
	const [chart, setchart] = useState(null);
	const [newlist, setnewlist] = useState([]);
	const showecharts = useRef();
	const {
		username,
		region,
		role: { roleName },
	} = JSON.parse(localStorage.getItem("token") || "");

	useEffect(() => {
		axios
			.get(
				`/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6`
			)
			.then((res) => {
				setviewList(res.data);
				const list = res.data;

				const newlist = list.map((item) => {
					return { value: item.view, name: item.title };
				});
				setnewlist(newlist);
			});

		return () => {
			window.onresize = null;
		};
	}, []);
	useEffect(() => {
		axios
			.get(
				`/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6`
			)
			.then((res) => {
				setstarList(res.data);
			});
	}, []);
	const renderEchrats = (newlist) => {
		var myChart;
		if (!chart) {
			// @ts-ignore
			myChart = echarts.init(showecharts.current);
			// @ts-ignore
			setchart(myChart);
		} else {
			myChart = chart;
		}

		var option = {
			title: {
				text: "用户访问最多的新闻",

				left: "center",
			},
			legend: {
				top: "10%",
				left: "center",
			},
			tooltip: {
				trigger: "item",
			},

			series: [
				{
					name: "浏览量",
					type: "pie",
					radius: ["30%", "50%"],
					avoidLabelOverlap: false,
					itemStyle: {
						borderRadius: 10,
						borderColor: "#fff",
						borderWidth: 2,
					},
					label: {
						show: false,
						position: "center",
					},
					emphasis: {
						label: {
							show: false,
							fontSize: "2",
							fontWeight: "bold",
						},
					},
					labelLine: {
						show: false,
					},
					data: newlist,
				},
			],
		};
		myChart.setOption(option);

		window.onresize = () => {
			myChart.resize();
		};
	};
	return (
		<div className="site-card-wrapper">
			<Row gutter={16}>
				<Col span={8}>
					<Card title="用户最多浏览" bordered={true}>
						<List
							size="small"
							dataSource={viewList}
							renderItem={(item) => (
								<List.Item>
									<a href={`#/news-manage/preview/${item["id"]}`}>
										{item["title"]}
									</a>
								</List.Item>
							)}
						></List>
					</Card>
				</Col>
				<Col span={8}>
					<Card title="用户最多点赞" bordered={true}>
						<List
							size="small"
							dataSource={starList}
							renderItem={(item) => (
								<List.Item>
									<a href={`#/news-manage/preview/${item["id"]}`}>
										{item["title"]}
									</a>
								</List.Item>
							)}
						></List>
					</Card>
				</Col>
				<Col span={8}>
					<Card
						bordered={true}
						cover={
							<img
								alt="example"
								src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
							/>
						}
						actions={[
							<FullscreenOutlined
								key="setting"
								onClick={() => {
									setvisible(true);
									setTimeout(() => {
										renderEchrats(newlist);
									}, 0);
								}}
							/>,
							<EditOutlined key="edit" />,
							<EllipsisOutlined key="ellipsis" />,
						]}
					>
						<Meta
							avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
							title={username}
							description={
								<div>
									<b>{region ? region : "全球"}</b>
									<span style={{ paddingLeft: "33px" }}>
										<i style={{ color: "#1890ff" }}>{roleName}</i>
									</span>
								</div>
							}
						/>
					</Card>
				</Col>
			</Row>
			<Drawer
				placement="right"
				width={500}
				visible={visible}
				onClose={() => {
					setvisible(false);
				}}
			>
				<div
					// @ts-ignore
					ref={showecharts}
					style={{ height: "100%" }}
				></div>
			</Drawer>
		</div>
	);
}
