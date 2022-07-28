import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, Button, Tag, notification } from "antd";

export default function Audit(props) {
	const [dataSource, setdataSource] = useState([]);
	const { roleId, author, region } = JSON.parse(
		localStorage.getItem("token") || ""
	);
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
			title: "操作",
			render: (item) => {
				return (
					<div>
						<Button type="primary" onClick={() => agree(item, 2, 1)}>
							通过
						</Button>
						<Button danger onClick={() => agree(item, 3, 0)}>
							驳回
						</Button>
					</div>
				);
			},
		},
	];

	useEffect(() => {
		axios.get(`/news?auditState=1&_expand=category`).then((res) => {
			const list = res.data;
			setdataSource(
				roleId === 1
					? list
					: [
							...list.filter((item) => item.author === author),
							...list.filter(
								(item) => item.region === region && item.roleId === 3
							),
					  ]
			);
		});
	}, [roleId, author, region]);
	// 同意
	const agree = (item, auditState, publishState) => {
		setdataSource(dataSource.filter((data) => data["id"] !== item.id));
		axios
			.patch(`/news/${item.id}`, {
				auditState,
				publishState,
			})
			.then(() => {
				notification.info({
					message: `提示`,
					description: `你可以在[审核管理/审核列表]中查看审核状态`,
					duration: 2,
					placement: "bottomRight",
				});
			});
	};
	return (
		<div>
			<Table
				columns={columns}
				dataSource={dataSource}
				pagination={{ pageSize: 5 }}
				rowKey={(item) => item["id"]}
			/>
		</div>
	);
}
