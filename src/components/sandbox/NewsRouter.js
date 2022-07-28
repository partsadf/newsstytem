import React, { useEffect, useState } from "react";

import { Spin } from "antd";

// 路由
import { Switch, Route, Redirect } from "react-router-dom";

// 组件
import Home from "../../views/sandbox/home";
import UserList from "../../views/sandbox/user-manage";
import RoleList from "../../views/sandbox/right-manage/RoleList";
import RightList from "../../views/sandbox/right-manage/RightList";
import Nopermission from "../../views/sandbox/nopermission";
import Audit from "../../views/sandbox/audit-manage/Audit";
import AuditList from "../../views/sandbox/audit-manage/AuditList";
import NewsAdd from "../../views/sandbox/news-manage/NewsAdd";
import NewsCategory from "../../views/sandbox/news-manage/NewsCategory";
import NewsDraft from "../../views/sandbox/news-manage/NewsDraft";
import Published from "../../views/sandbox/publish-manage/Published";
import Unpublished from "../../views/sandbox/publish-manage/Unpublished";
import Sunset from "../../views/sandbox/publish-manage/Sunset";
import NewsPreview from "../../views/sandbox/news-manage/NewsPreview";
import NewsUpdate from "../../views/sandbox/news-manage/NewsUpdate";
import axios from "axios";
import { connect } from "react-redux";

const LocalRouterMap = {
	"/home": Home,
	"/user-manage/list": UserList,
	"/right-manage/role/list": RoleList,
	"/right-manage/right/list": RightList,
	"/news-manage/add": NewsAdd,
	"/news-manage/draft": NewsDraft,
	"/news-manage/category": NewsCategory,
	"/news-manage/preview/:id": NewsPreview,
	"/news-manage/update/:id": NewsUpdate,

	"/audit-manage/audit": Audit,
	"/audit-manage/list": AuditList,
	"/publish-manage/unpublished": Unpublished,
	"/publish-manage/published": Published,
	"/publish-manage/sunset": Sunset,
};
function NewsRouter(props) {
	const [BackRouteList, setBackRouteList] = useState([]);
	// 函数
	useEffect(() => {
		Promise.all([axios.get("/rights"), axios.get("/children")]).then((res) => {
			// @ts-ignore
			return setBackRouteList([...res[0].data, ...res[1].data]);
		});
	}, []);
	const checkRoute = (item) => {
		return (
			LocalRouterMap[item["key"]] && (item.pagepermisson || item.routepermisson)
		);
	};
	const {
		role: { rights },
		// @ts-ignore
	} = JSON.parse(localStorage.getItem("token" || ""));
	const checkUserPermission = (item) => {
		return rights.includes(item.key);
	};
	return (
		<div>
			{/* @ts-ignore */}
			<Spin tip="Loading..." spinning={props.isLoading}>
				<Switch>
					{BackRouteList.map((item) => {
						if (checkRoute(item) && checkUserPermission(item)) {
							return (
								<Route
									path={item["key"]}
									key={item["key"]}
									component={LocalRouterMap[item["key"]]}
									exact
								></Route>
							);
						} else {
							return null;
						}
					})}
					<Redirect from="/" to="/home" exact></Redirect>
					{BackRouteList.length > 0 && (
						<Route path="*" component={Nopermission}></Route>
					)}
				</Switch>
			</Spin>
		</div>
	);
}
const mapStateToProps = ({ LoadingReducer: { isLoading } }) => {
	return {
		isLoading,
	};
};
export default connect(mapStateToProps)(NewsRouter);
