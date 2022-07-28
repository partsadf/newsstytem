import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Tree } from "antd";
import axios from "axios";
import {
	DeleteOutlined,
	EditOutlined,
	ExclamationCircleOutlined,
} from "@ant-design/icons";
const { confirm } = Modal;
export default function RoleList() {
	// 数据
	const [dataSourse, setDataSourse] = useState([]);
	const [rightList, setrightList] = useState([]);
	const [currentList, setcurrentList] = useState([]);
	const [currentId, setcurrentId] = useState(0);
	const [isModalVisible, setisModalVisible] = useState(false);
	const columns = [
		{
			title: "ID",
			dataIndex: "id",
			render: (id) => {
				return <b>{id}</b>;
			},
		},
		{
			title: "角色名称",
			dataIndex: "roleName",
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
							type="primary"
							shape="circle"
							icon={<EditOutlined />}
							onClick={() => showModal(item)}
						/>
					</div>
				);
			},
		},
	];
	useEffect(() => {
		axios.get("/roles").then((res) => {
			setDataSourse(res.data);
		});
	}, []);
	useEffect(() => {
		axios.get("/rights?_embed=children").then((res) => {
			setrightList(res.data);
		});
	}, []);

	// 点击删除按钮事件回调
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
		setDataSourse(dataSourse.filter((i) => i["id"] !== item.id));
		axios.delete(`/roles/${item.id}`);
	};
	// 模态框展示与隐藏
	const showModal = (item) => {
		setisModalVisible(!isModalVisible);
		setcurrentList(item.rights);
		setcurrentId(item.id);
	};
	// 模态框点击ok
	const handleOk = (currentId) => {
		setisModalVisible(!isModalVisible);
		// @ts-ignore
		setDataSourse(
			// @ts-ignore
			dataSourse.map((item) => {
				if (item["id"] === currentId) {
					return {
						// @ts-ignore
						...item,
						rights: currentList,
					};
				}
				return item;
			})
		);
		axios.patch(`/roles/${currentId}`, {
			rights: currentList,
		});
	};
	// 模态框点击cancel
	const handleCancel = () => {
		setisModalVisible(!isModalVisible);
	};
	//Tree中结构复选框点击事件回调
	const onCheck = (checkedKeys) => {
		setcurrentList(checkedKeys);
	};
	return (
		<div>
			<Table
				columns={columns}
				dataSource={dataSourse}
				pagination={{ pageSize: 5 }}
				rowKey={(item) => {
					return item["id"];
				}}
			/>
			{/* @ts-ignore */}
			<Modal
				Modal
				title="权限分配"
				visible={isModalVisible}
				onOk={() => handleOk(currentId)}
				onCancel={handleCancel}
			>
				<Tree
					checkable
					onCheck={onCheck}
					checkedKeys={currentList}
					treeData={rightList}
				/>
			</Modal>
		</div>
	);
}
