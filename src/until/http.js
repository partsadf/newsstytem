import axios from "axios";

import store from "../redux/store";
axios.defaults.baseURL = "http://localhost:5000";

// axios.defaults.headers

// 发送请求前
axios.interceptors.request.use(
	function (config) {
		store.dispatch({
			type: "change_loading",
			payload: true,
		});
		return config;
	},
	function (error) {
		return Promise.reject(error);
	}
);

axios.interceptors.response.use(
	function (response) {
		store.dispatch({
			type: "change_loading",
			payload: false,
		});
		return response;
	},
	function (error) {
		return Promise.reject(error);
	}
);
