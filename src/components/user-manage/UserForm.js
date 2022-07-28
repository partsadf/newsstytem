// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Form, Input, Select } from "antd";

const UserForm = React.forwardRef((props, ref) => {
	const [state, setstate] = useState(false);
	const { Option } = Select;

	const { roleId, region } = JSON.parse(localStorage.getItem("token") || "");
	useEffect(() => {
		setstate(props.visible);
	}, [props.visible]);

	return (
		<Form
			ref={ref}
			layout="vertical"
			initialValues={{
				region: region,
				roleId: roleId === 1 ? 1 : 3,
			}}
		>
			<Form.Item
				name="username"
				label="用户名"
				rules={[
					{
						required: true,
						message: "Please input the title of collection!",
					},
				]}
			>
				<Input />
			</Form.Item>
			<Form.Item
				name="password"
				label="密码"
				rules={[
					{
						required: true,
						message: "Please input the title of collection!",
					},
				]}
			>
				<Input />
			</Form.Item>
			<Form.Item
				name="region"
				label="区域"
				rules={
					state
						? []
						: [
								{
									required: true,
									message: "Please input the title of collection!",
								},
						  ]
				}
			>
				<Select disabled={state} name="region">
					{props.regionList // @ts-ignore
						.map((item) => {
							return (
								<Option
									key={item["id"]}
									value={item["title"]}
									disabled={roleId === 1 ? false : true}
								>
									{item["title"]}
								</Option>
							);
						})}
				</Select>
			</Form.Item>
			<Form.Item
				name="roleId"
				label="角色"
				rules={[
					{
						required: true,
						message: "Please input the title of collection!",
					},
				]}
			>
				<Select
					name="roleId"
					onChange={(value) => {
						if (value === 1) {
							setstate(true);
							// @ts-ignore
							ref.current.setFieldsValue({
								region: "",
							});
						} else {
							setstate(false);
						}
					}}
				>
					{props.roleList // @ts-ignore
						.map((item) => {
							return (
								<Option
									key={item["id"]}
									value={item["id"]}
									disabled={roleId === 1 ? false : true}
								>
									{item["roleName"]}
								</Option>
							);
						})}
				</Select>
			</Form.Item>
		</Form>
	);
});
export default UserForm;
