// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import {
	Button,
	PageHeader,
	Steps,
	Form,
	Select,
	Input,
	message,
	notification,
} from "antd";
import style from "./NewsAdd.module.css";
import axios from "axios";

import NewsEditor from "../../../components/news-manage/NewsEditor";
const { Step } = Steps;
const { Option } = Select;

export default function NewsUpdate(props) {
	const [current, setcurrent] = useState(0);
	const [categoryList, setcategoryList] = useState([]);
	const [formInfo, setformInfo] = useState("");
	const [newscontent, setnewscontent] = useState("");
	const [content, setcontent] = useState("");
	const NewsForm = useRef();

	// 函数
	useEffect(() => {
		axios.get("/categories").then((res) => {
			setcategoryList(res.data);
		});
	}, []);
	useEffect(() => {
		axios
			.get(`/news/${props.match.params.id}?_expand=category&_expand=role`)
			.then((res) => {
				const { title, categoryId, content } = res.data;
				NewsForm.current.setFieldsValue({
					title,
					categoryId,
				});
				setcontent(content);
			});
	}, [props.match.params.id]);
	// 上一步
	const handlerNext = () => {
		setcurrent(current - 1);
	};
	// 下一步
	const handlerprev = () => {
		if (current === 0) {
			NewsForm.current
				?.validateFields()
				.then((res) => {
					setformInfo(res);
					setcurrent(current + 1);
				})
				.catch((error) => {
					console.log(error);
				});
		} else {
			if (newscontent === "" || newscontent.trim() === "<p></p>") {
				message.error("新闻内容不能为空！");
			} else {
				setcurrent(current + 1);
			}
		}
	};
	// 保存草稿箱 提交审核
	const handlerSave = (id) => {
		axios
			.patch(`/news/${props.match.params.id}`, {
				...formInfo,
				content: newscontent,

				auditState: id,
				publishState: 0,
				createTime: Date.now(),
				star: 0,
				view: 0,
			})
			.then((res) => {
				notification.info({
					message: `提示`,
					description: `你可以在${
						id === 0 ? "草稿箱" : "审核列表"
					}中查看新闻内容`,
					duration: 2,
					placement: "bottomRight",
				});
			});
	};

	return (
		<div className={style.news}>
			<PageHeader
				className="site-page-header"
				onBack={() => window.history.back()}
				title="更新新闻"
				subTitle=""
			/>
			,{/* @ts-ignore */}
			<Steps current={current}>
				<Step title="基本信息" description="新闻标题，新闻分类" />
				<Step title="新闻内容" subTitle="" description="新闻主体内容" />
				<Step title="新闻提交" description="保存草稿或提交审核" />
			</Steps>
			,
			<div>
				<div className={current === 0 ? "" : style.show}>
					<Form
						name="control-hooks"
						// @ts-ignore
						ref={NewsForm}
					>
						<Form.Item
							name="title"
							label="新闻标题"
							rules={[
								{ required: true, message: "Please input your username!" },
							]}
						>
							<Input />
						</Form.Item>
						<Form.Item
							name="categoryId"
							label="新闻分类"
							rules={[
								{ required: true, message: "Please input your username!" },
							]}
						>
							<Select placeholder="请选择一项新闻分类" allowClear>
								{categoryList.map((item) => {
									return (
										<Option key={item["id"]} value={item["id"]}>
											{item["title"]}
										</Option>
									);
								})}
							</Select>
						</Form.Item>
					</Form>
				</div>
				<div className={current === 1 ? "" : style.show}>
					<NewsEditor
						getTextInfo={(value) => {
							setnewscontent(value);
						}}
						content={content}
					></NewsEditor>
				</div>
			</div>
			<div className={style.controll}>
				{current > 0 ? <Button onClick={handlerNext}>上一步</Button> : ""}
				{current < 2 ? (
					<Button onClick={handlerprev} type="primary">
						下一步
					</Button>
				) : (
					""
				)}
				{current === 2 ? (
					<Button danger onClick={() => handlerSave(0)}>
						保存至草稿箱
					</Button>
				) : (
					""
				)}
				{current === 2 ? (
					<Button type="primary" onClick={() => handlerSave(1)}>
						提交审核
					</Button>
				) : (
					""
				)}
			</div>
		</div>
	);
}
