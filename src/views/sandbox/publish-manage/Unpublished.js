import NewsPublish from "../../../components/news-manage/NewsPublish";
import usePublish from "../../../components/publish-manage/usePublish";
import { Button } from "antd";
import React from "react";

export default function Unpublished() {
	// @ts-ignore
	const { dataSource, publish } = usePublish(1);
	return (
		<div>
			<NewsPublish
				// @ts-ignore
				dataSource={dataSource}
				button={(id) => (
					<Button type="primary" onClick={() => publish(id)}>
						发布
					</Button>
				)}
			></NewsPublish>
		</div>
	);
}
