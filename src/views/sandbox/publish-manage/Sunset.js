import NewsPublish from "../../../components/news-manage/NewsPublish";
import usePublish from "../../../components/publish-manage/usePublish";
import { Button } from "antd";

export default function Sunset() {
	// @ts-ignore
	const { dataSource, deleteItem } = usePublish(3);
	return (
		<div>
			<NewsPublish
				// @ts-ignore
				dataSource={dataSource}
				button={(id) => (
					<Button type="primary" onClick={() => deleteItem(id)}>
						重新发布
					</Button>
				)}
			></NewsPublish>
		</div>
	);
}
