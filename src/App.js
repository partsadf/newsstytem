import React from "react";
import Routers from "./router";
import "./App.css";

// 引入Provider 和store 为子孙组件提供store
import { Provider } from "react-redux";
import store from "./redux/store";

export default function App() {
	return (
		<Provider store={store}>
			<Routers></Routers>
		</Provider>
	);
}
