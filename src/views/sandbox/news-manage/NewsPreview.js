import React, { useEffect, useState } from "react";
import { PageHeader, Descriptions } from "antd";
import axios from "axios";
import moment from "moment";

export default function NewsPreview(props) {
	const [newsInfo, setnewsInfo] = useState(null);
	useEffect(() => {
		axios
			.get(`/news/${props.match.params.id}?_expand=category&_expand=role`)
			.then((res) => {
				setnewsInfo(res.data);
			});
	}, [props.match.params.id]);
	return (
		newsInfo && (
			<div>
				{/* @ts-ignore */}
				<PageHeader
					ghost={false}
					onBack={() => window.history.back()}
					title={newsInfo["title"]}
					subTitle={newsInfo["category"]["title"]}
				>
					<Descriptions size="small" column={3}>
						<Descriptions.Item label="创建者">
							{newsInfo["author"]}
						</Descriptions.Item>
						<Descriptions.Item label="创建时间">
							{moment(newsInfo["createTime"]).format("YYYY/MM/DD ")}
						</Descriptions.Item>
						<Descriptions.Item label="发布时间">
							{newsInfo["publishTime"]
								? moment(newsInfo["publishTime"]).format("YYYY/MM/DD ")
								: "--"}
						</Descriptions.Item>
						<Descriptions.Item label="区域">
							{newsInfo["region"]}
						</Descriptions.Item>
						<Descriptions.Item label="审核状态">
							{newsInfo["auditState"] === 0
								? "未审核"
								: newsInfo["auditState"] === 1
								? "审核中"
								: newsInfo["auditState"] === 2
								? "审核通过"
								: "未通过"}
						</Descriptions.Item>
						<Descriptions.Item label="发布状态">
							{newsInfo["publishState"] === 0
								? "未发布"
								: newsInfo["publishState"] === 1
								? "待发布"
								: newsInfo["publishState"] === 2
								? "已发布"
								: "已下线"}
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
					style={{ border: "1px solid #ccc", padding: "5px" }}
				></div>
			</div>
		)
	);
}
