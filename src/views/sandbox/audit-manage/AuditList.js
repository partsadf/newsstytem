import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, Button, Tag, notification } from "antd";

export default function AuditList(props) {
	const { username } = JSON.parse(localStorage.getItem("token") || "");
	const [newsList, setnewsList] = useState([]);
	const columns = [
		{
			title: "新闻标题",
			dataIndex: "title",
			render: (title, item) => {
				return (
					<Tag
						onClick={() => {
							props.history.push(`/news-manage/preview/${item.id}`);
						}}
					>
						{title}
					</Tag>
				);
			},
		},
		{
			title: "作者",
			dataIndex: "author",
		},
		{
			title: "新闻分类",
			dataIndex: "category",
			render: (category) => {
				return category.value;
			},
		},
		{
			title: "审核状态",
			dataIndex: "auditState",
			render: (auditState) => {
				return auditState === 1 ? (
					<Tag color="orange">审核中</Tag>
				) : auditState === 2 ? (
					<Tag color="green">已通过</Tag>
				) : (
					<Tag color="red">未通过</Tag>
				);
			},
		},
		{
			title: "操作",
			render: (item) => {
				return (
					<div>
						{item.auditState === 1 ? (
							<Button danger onClick={() => rervert(item)}>
								撤销
							</Button>
						) : item.auditState === 2 ? (
							<Button type="primary" onClick={() => publish(item)}>
								发布
							</Button>
						) : (
							<Button type="primary" onClick={() => update(item)}>
								更新
							</Button>
						)}
					</div>
				);
			},
		},
	];

	// 函数
	useEffect(() => {
		axios
			.get(
				`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`
			)
			.then((res) => {
				setnewsList(res.data);
			});
	}, [username]);
	// 发布
	const publish = (item) => {
		const newlist = newsList.filter((i) => {
			return i["id"] !== item.id;
		});
		// @ts-ignore
		setnewsList(newlist);
		axios
			.patch(`news/${item.id}`, { publishState: 2, publishTime: Date.now() })
			.then(() => {
				notification.info({
					message: `提示`,
					description: `你可以在[发布管理/已发布]中查看新闻内容`,
					duration: 2,
					placement: "bottomRight",
				});
			});
	};
	// 更新
	const update = (item) => {
		props.history.push(`/news-manage/update/${item.id}`);
	};
	// 撤销
	const rervert = (item) => {
		const list = newsList.filter((i) => {
			return i["id"] !== item.id;
		});
		// @ts-ignore
		setnewsList(list);
		axios.patch(`/news/${item.id}`, { auditState: 0 }).then(() => {
			notification.info({
				message: `提示`,
				description: `你可以在草稿箱中查看新闻内容`,
				duration: 2,
				placement: "bottomRight",
			});
		});
	};

	return (
		<div>
			<Table
				columns={columns}
				dataSource={newsList}
				pagination={{ pageSize: 5 }}
				rowKey={(item) => item["id"]}
			/>
		</div>
	);
}
