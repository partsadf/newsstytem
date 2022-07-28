// @ts-nocheck
import React, { useEffect, useState, useRef } from "react";
import { Table, Button, Modal, Switch } from "antd";
import axios from "axios";
import {
	DeleteOutlined,
	EditOutlined,
	ExclamationCircleOutlined,
} from "@ant-design/icons";
import UserForm from "../../../components/user-manage/UserForm";

export default function UsersList() {
	const [dataSource, setdataSource] = useState([]);
	const [regionList, setregionList] = useState([]);
	const [roleList, setroleList] = useState([]);
	const [current, setcurrent] = useState(null);
	const [isvisible, setisvisible] = useState(false);
	const [Upisvisible, setUpisvisible] = useState(false);
	const [visible, setvisible] = useState(false);
	const addForm = useRef();
	const UpdateForm = useRef();
	const { confirm } = Modal;

	const columns = [
		{
			title: "区域",
			dataIndex: "region",
			filters: [
				...regionList.map((item) => ({
					text: item.title,
					value: item.value,
				})),
				{
					text: "全球1",
					value: "",
				},
			],
			onFilter: (value, item) => item.region === value,

			render: (region) => {
				return <b>{region === "" ? "全球" : region}</b>;
			},
		},
		{
			title: "角色名称",
			dataIndex: "role",
			render: (role) => {
				return role.roleName;
			},
		},
		{
			title: "用户名",
			dataIndex: "username",
		},
		{
			title: "用户状态",
			dataIndex: "roleState",
			render: (roleState, item) => {
				return (
					<Switch
						checked={roleState}
						disabled={item.default}
						onChange={() => handleOnchange(item)}
					></Switch>
				);
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
							disabled={item.default}
							onClick={() => deleteItem(item)}
						/>

						<Button
							type="primary"
							shape="circle"
							icon={<EditOutlined />}
							disabled={item.default}
							onClick={() => hanlderUpdate(item)}
						/>
					</div>
				);
			},
		},
	];
	const { roleId, username, region } = JSON.parse(
		localStorage.getItem("token") || ""
	);
	useEffect(() => {
		axios.get("/users?_expand=role").then((res) => {
			const list = res.data;
			setdataSource(
				roleId === 1
					? list
					: [
							...list.filter((item) => item.username === username),
							...list.filter(
								(item) => item.region === region && item.roleId === 3
							),
					  ]
			);
		});
	}, [roleId, username, region]);
	useEffect(() => {
		axios.get("/roles").then((res) => {
			setroleList(res.data);
		});
	}, []);
	useEffect(() => {
		axios.get("/regions").then((res) => {
			setregionList(res.data);
		});
	}, []);

	// 点击编辑按钮
	const hanlderUpdate = (item) => {
		setTimeout(() => {
			setUpisvisible(true);
			UpdateForm.current.setFieldsValue(item);
		}, 0);
		if (item.roleId === 1) {
			setvisible(true);
		} else {
			setvisible(false);
		}
		setcurrent(item);
	};
	// 点击编辑的确定按钮
	const UpdateFormOk = () => {
		setUpisvisible(false);
		UpdateForm.current.validateFields().then((value) => {
			setdataSource(
				dataSource.map((item) => {
					if (item.id === current.id) {
						return {
							...item,
							...value,
							role: roleList.filter((data) => data.id === value.roleId)[0],
						};
					}
					return item;
				})
			);
			axios.patch(`/users/${current.id}`, value);
		});
	};
	// 点击用户状态的开关
	const handleOnchange = (item) => {
		item.roleState = !item.roleState;
		setdataSource([...dataSource]);
		axios.patch(`/users/${item.id}`, {
			roleState: item.roleState,
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
		setdataSource(dataSource.filter((i) => i["id"] !== item.id));
		axios.delete(`/users/${item.id}`);
	};
	// form框点击ok的事件回调
	const addFormOk = () => {
		// 模态框消失
		setisvisible(false);
		// @ts-ignore 向后端发送post请求添加数据
		addForm.current.validateFields().then((value) => {
			// 清空原来from表单的数据
			addForm.current.resetFields();
			axios
				.post(`/users`, {
					...value,
					roleState: true,
					default: false,
				})
				.then((res) => {
					// 同步前端 展示添加内容
					// @ts-ignore
					setdataSource([
						...dataSource,
						{
							...res.data,
							role: roleList.filter((item) => item.id === value.roleId)[0],
						},
					]);
				})
				.catch((err) => {
					console.log(err);
				});
		});
	};
	return (
		<div style={{ height: "100%", overflow: "auto" }}>
			<Button type="primary" onClick={() => setisvisible(true)}>
				添加用户
			</Button>
			<Table
				columns={columns}
				dataSource={dataSource}
				pagination={{ pageSize: 5 }}
				rowKey={(item) => item["id"]}
			/>
			{/* @ts-ignore */}
			<Modal
				visible={isvisible}
				title="创建一个新用户"
				okText="确定"
				cancelText="取消"
				onCancel={() => {
					setisvisible(false);
				}}
				onOk={addFormOk}
			>
				<UserForm
					// @ts-ignore
					regionList={regionList}
					roleList={roleList}
					ref={addForm}
				></UserForm>
			</Modal>

			<Modal
				visible={Upisvisible}
				title="更新用户"
				okText="确定"
				cancelText="取消"
				onCancel={() => {
					setUpisvisible(false);
					setvisible(visible);
				}}
				onOk={UpdateFormOk}
			>
				<UserForm
					// @ts-ignore
					regionList={regionList}
					roleList={roleList}
					ref={UpdateForm}
					visible={visible}
				></UserForm>
			</Modal>
		</div>
	);
}
