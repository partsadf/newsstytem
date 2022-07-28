import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Tag, notification } from "antd";
import axios from "axios";
import {
	DeleteOutlined,
	EditOutlined,
	ExclamationCircleOutlined,
	UploadOutlined,
} from "@ant-design/icons";
const { confirm } = Modal;

export default function NewsDraft(props) {
	const [data, setData] = useState([]);
	const columns = [
		{
			title: "ID",
			dataIndex: "id",
			render: (id) => {
				return <b>{id}</b>;
			},
		},
		{
			title: "新闻标题",
			dataIndex: "title",
			render: (title, item) => {
				return (
					<Tag
						color="orange"
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
			title: "分类",
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
						<Button
							danger
							shape="circle"
							icon={<DeleteOutlined />}
							onClick={() => deleteItem(item)}
						/>

						<Button
							title="修改"
							type="primary"
							shape="circle"
							icon={<EditOutlined />}
							onClick={() => {
								props.history.push(`/news-manage/update/${item.id}`);
							}}
						/>
						<Button
							title="保存至审核列表"
							type="primary"
							shape="circle"
							icon={<UploadOutlined />}
							onClick={() => handlerCheck(item)}
						/>
					</div>
				);
			},
		},
	];
	const { username } = JSON.parse(localStorage.getItem("token") || "");
	// 函数
	useEffect(() => {
		axios
			.get(`/news?author=${username}&auditState=0&_expand=category`)
			.then((res) => {
				const list = res.data;

				setData(list);
			});
	}, [username]);
	// 点击上传按钮
	const handlerCheck = (item) => {
		axios.patch(`news/${item.id}`, { auditState: 1 }).then(() => {
			notification.info({
				message: `提示`,
				description: `你可以在审核列表中查看新闻内容`,
				duration: 2,
				placement: "bottomRight",
			});
		});
	};

	// 点击删除按钮的回调
	const deleteItem = (item) => {
		confirm({
			title: "确认删除?",
			icon: <ExclamationCircleOutlined />,
			onOk() {
				deleteTrue(item);
			},
			onCancel() {},
		});
	};
	// 确认删除后的回调
	const deleteTrue = (item) => {
		setData([
			...data.filter((i) => {
				return item.id !== i["id"];
			}),
		]);
		axios.delete(`/news/${item.id}`);
	};
	return (
		<div style={{ height: "100%", overflow: "auto" }}>
			<Table
				columns={columns}
				dataSource={data}
				pagination={{ pageSize: 5 }}
				rowKey={(item) => item["id"]}
			/>
		</div>
	);
}
