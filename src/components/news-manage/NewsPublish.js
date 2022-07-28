import React from "react";
import { Table, Tag } from "antd";
import { withRouter } from "react-router-dom";

function NewsPublish(props) {
	const { dataSource } = props;
	const columns = [
		{
			title: "新闻标题",
			dataIndex: "title",
			render: (title, item) => {
				return (
					<Tag
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
			title: "新闻分类",
			dataIndex: "category",
			render: (category) => {
				return category.value;
			},
		},

		{
			title: "操作",
			render: (item) => {
				return props.button(item.id);
			},
		},
	];

	return (
		<Table
			columns={columns}
			dataSource={dataSource}
			pagination={{ pageSize: 5 }}
			rowKey={(item) => item["id"]}
		/>
	);
}
export default withRouter(NewsPublish);
