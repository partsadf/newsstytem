// @ts-nocheck
import React, { useEffect, useState } from "react";
import { PageHeader, Descriptions } from "antd";
import { HeartTwoTone } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";

export default function Detail(props) {
	const [newsInfo, setnewsInfo] = useState(null);

	// 函数
	useEffect(() => {
		axios
			.get(`/news/${props.match.params.id}?_expand=category&_expand=role`)
			.then((res) => {
				setnewsInfo({
					...res.data,
					view: res.data.view + 1,
				});
				return res.data;
			})
			.then((res) => {
				axios.patch(`/news/${props.match.params.id}`, {
					view: res.view + 1,
				});
			});
	}, [props.match.params.id]);
	// 点赞
	const handlerlike = () => {
		setnewsInfo({
			...newsInfo,
			star: newsInfo.star + 1,
		});
		axios.patch(`/news/${props.match.params.id}`, {
			star: newsInfo.star + 1,
		});
	};
	return (
		newsInfo && (
			<div>
				{/* @ts-ignore */}

				<PageHeader
					onBack={() => window.history.back()}
					title={newsInfo["title"]}
					subTitle={
						<div>
							{newsInfo["category"]["title"]}
							<span style={{ marginLeft: "5px" }}>
								{
									<HeartTwoTone
										twoToneColor="#eb2f96"
										onClick={() => handlerlike()}
									/>
								}
							</span>
						</div>
					}
				>
					<Descriptions size="small" column={3}>
						<Descriptions.Item label="创建者">
							{newsInfo["author"]}
						</Descriptions.Item>

						<Descriptions.Item label="发布时间">
							{newsInfo["publishTime"]
								? moment(newsInfo["publishTime"]).format("YYYY/MM/DD ")
								: "--"}
						</Descriptions.Item>
						<Descriptions.Item label="区域">
							{newsInfo["region"]}
						</Descriptions.Item>

						<Descriptions.Item label="访问量">
							{newsInfo["view"]}
						</Descriptions.Item>
						<Descriptions.Item label="点赞量">
							{newsInfo["star"]}
						</Descriptions.Item>
						<Descriptions.Item label="评论量">0</Descriptions.Item>
					</Descriptions>
				</PageHeader>
				<div
					dangerouslySetInnerHTML={{ __html: newsInfo["content"] }}
					style={{ padding: "5px" }}
				></div>
			</div>
		)
	);
}
