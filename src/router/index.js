// @ts-nocheck
import React from "react";
import { Redirect } from "react-router-dom";
import { HashRouter, Route, Switch } from "react-router-dom";
import Login from "../views/login/Login";
import News from "../views/news/News";
import Detail from "../views/news/Detail";
import NewsSandBox from "../views/sandbox/NewsSandBox";

export default function Index() {
	return (
		// @ts-ignore
		<HashRouter>
			<Switch>
				<Route path="/login" component={Login}></Route>
				<Route path="/news" component={News}></Route>
				<Route path="/detail/:id" component={Detail}></Route>
				<Route
					path="/"
					render={() =>
						localStorage.getItem("token") ? (
							<NewsSandBox></NewsSandBox>
						) : (
							<Redirect to="/login"></Redirect>
						)
					}
				></Route>
			</Switch>
		</HashRouter>
	);
}
