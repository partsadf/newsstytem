import NewsPublish from "../../../components/news-manage/NewsPublish";
import usePublish from "../../../components/publish-manage/usePublish";
import { Button } from "antd";

export default function Published() {
	// @ts-ignore
	const { dataSource, goout } = usePublish(2);
	return (
		<div>
			<NewsPublish
				// @ts-ignore
				dataSource={dataSource}
				button={(id) => (
					<Button type="primary" onClick={() => goout(id)}>
						下线
					</Button>
				)}
			></NewsPublish>
		</div>
	);
}
