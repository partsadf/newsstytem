import React, { useEffect, useState } from "react";
import { Table, Tag, Button, Modal, Popover, Switch } from "antd";
import axios from "axios";
import {
	DeleteOutlined,
	EditOutlined,
	ExclamationCircleOutlined,
} from "@ant-design/icons";

export default function RightList() {
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
			title: "权限名称",
			dataIndex: "title",
		},
		{
			title: "权限路径",
			dataIndex: "key",
			render: (key) => {
				return <Tag color="orange">{key}</Tag>;
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
						<Popover
							content={
								<div style={{ textAlign: "center" }}>
									<Switch
										checked={item.pagepermisson}
										onChange={() => changeSwitch(item)}
									></Switch>
								</div>
							}
							title="页面配置项"
							trigger={item.pagepermisson === undefined ? "" : "click"}
						>
							<Button
								type="primary"
								shape="circle"
								icon={<EditOutlined />}
								disabled={item.pagepermisson === undefined}
							/>
						</Popover>
					</div>
				);
			},
		},
	];
	useEffect(() => {
		axios.get("/rights?_embed=children").then((res) => {
			const list = res.data;
			list.forEach((element) => {
				if (element.children.length === 0) {
					element.children = "";
				}
			});
			setData(list);
		});
	}, []);
	// 点击switch开关的回调
	const changeSwitch = (item) => {
		item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
		setData([...data]);
		if (item.grade === 1) {
			axios.patch(`/rights/${item.id}`, {
				pagepermisson: item.pagepermisson,
			});
		} else {
			axios.patch(`/children/${item.id}`, {
				pagepermisson: item.pagepermisson,
			});
		}
	};
	const { confirm } = Modal;
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
		if (item.grade === 1) {
			setData(data.filter((i) => i["id"] !== item.id));
			axios.delete(`/rights/${item.id}`);
		} else {
			const list = data.filter((i) => i["id"] === item.rightId);
			list[0].children = list[0].children.filter((i) => i.id !== item.id);
			setData([...data]);
			axios.delete(`/children/${item.id}`);
		}
	};
	return (
		<div style={{ height: "100%", overflow: "auto" }}>
			<Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />
		</div>
	);
}
