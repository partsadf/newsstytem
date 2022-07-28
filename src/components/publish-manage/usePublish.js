import axios from "axios";
import { useEffect, useState } from "react";
import { notification, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import React from "react";
const { confirm } = Modal;

function usePublish(type) {
	const [dataSource, setdataSource] = useState([]);
	useEffect(() => {
		const { username } = JSON.parse(localStorage.getItem("token") || "");

		axios
			.get(`/news/?author=${username}&publishState=${type}&_expand=category`)
			.then((res) => {
				setdataSource(res.data);
			});
	}, [type]);
	// 发布
	const publish = (id) => {
		setdataSource(
			dataSource.filter((data) => {
				return data["id"] !== id;
			})
		);
		axios
			.patch(`news/${id}`, { publishState: 2, publishTime: Date.now() })
			.then(() => {
				notification.info({
					message: `提示`,
					description: `你可以在[发布管理/已发布]中查看新闻状态`,
					duration: 2,
					placement: "bottomRight",
				});
			});
	};
	// 下线
	const goout = (id) => {
		setdataSource(
			dataSource.filter((data) => {
				return data["id"] !== id;
			})
		);

		axios.patch(`news/${id}`, { publishState: 3 }).then(() => {
			notification.info({
				message: `提示`,
				description: `你可以在[发布管理/已下线]中查看新闻状态`,
				duration: 2,
				placement: "bottomRight",
			});
		});
	};
	// 重新发布
	const deleteItem = (id) => {
		confirm({
			title: "是否重新发布?",
			icon: <ExclamationCircleOutlined />,
			onOk() {
				deleteTrue(id);
			},
			onCancel() {},
		});
	};
	// 确认重新发布
	const deleteTrue = (id) => {
		setdataSource(
			dataSource.filter((data) => {
				return data["id"] !== id;
			})
		);
		axios.patch(`/news/${id}`, {
			publishState: 2,
		});
	};
	return { dataSource, publish, goout, deleteItem };
}

export default usePublish;
