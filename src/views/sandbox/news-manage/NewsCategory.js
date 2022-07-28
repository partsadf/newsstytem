import React, { useEffect, useState, useRef } from "react";
import { Table, Button, Modal, Tag, Form, Input } from "antd";
import axios from "axios";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
const { confirm } = Modal;

export default function NewsCategory(props) {
	const [data, setData] = useState([]);
	const [isvisible, setisvisible] = useState(false);
	const addCate = useRef();
	const columns = [
		{
			title: "ID",
			dataIndex: "id",
			render: (id) => {
				return <b>{id}</b>;
			},
		},
		{
			title: "新闻分类",
			dataIndex: "title",
			render: (title, item) => {
				return <Tag color="orange">{title} </Tag>;
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
					</div>
				);
			},
		},
	];
	// 函数
	useEffect(() => {
		axios.get(`/categories`).then((res) => {
			setData(res.data);
		});
	}, []);

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
		axios.delete(`/categories/${item.id}`);
	};
	// 添加新闻分类
	const addCategory = () => {
		setisvisible(true);
	};
	// 确认按钮
	const addFormOk = () => {
		setisvisible(false);
		// @ts-ignore 向后端发送post请求添加数据
		addCate.current.validateFields().then((value) => {
			axios
				.post(`/categories`, {
					...value,
				})
				.then((res) => {
					// 同步前端 展示添加内容
					// @ts-ignore
					setData([...data, res.data]);
				})
				.catch((err) => {
					console.log(err);
				});
		});
	};
	return (
		<div style={{ height: "100%", overflow: "auto" }}>
			<Button type="primary" onClick={() => addCategory()}>
				添加新闻分类
			</Button>
			<Table
				columns={columns}
				dataSource={data}
				pagination={{ pageSize: 5 }}
				rowKey={(item) => item["id"]}
			/>
			{/* @ts-ignore */}
			<Modal
				visible={isvisible}
				title="添加一项新闻分类"
				okText="确定"
				cancelText="取消"
				onCancel={() => {
					setisvisible(false);
				}}
				onOk={addFormOk}
			>
				<Form
					name="basic"
					// @ts-ignore
					ref={addCate}
					initialValues={{
						remember: true,
					}}
					autoComplete="off"
				>
					<Form.Item
						label="新闻分类名称"
						name="title"
						rules={[
							{
								required: true,
								message: "请填写内容",
							},
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label="新闻分类内容"
						name="value"
						rules={[
							{
								required: true,
								message: "请填写内容",
							},
						]}
					>
						<Input />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}
