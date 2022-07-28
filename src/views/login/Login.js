// @ts-nocheck
import React from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { UserAddOutlined, LoginOutlined } from "@ant-design/icons";
import "./Login.css";
// 引入react-tsparticles粒子背景
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import axios from "axios";

const particlesInit = async (main) => {
	await loadFull(main);
};

export default function Login(props) {
	const onFinish = (values) => {
		axios
			.get(
				`/users?_expand=role&username=${values.Username}&password=${values.password}&roleState=true`
			)
			.then((res) => {
				if (res.data.length === 0) {
					message.error("用户名或密码不匹配");
				} else {
					localStorage.setItem("token", JSON.stringify(res.data[0]));
					props.history.push("/");
				}
			});
	};
	return (
		<div style={{ background: "rgb(35,39,65)", height: "100%" }}>
			<Particles
				id="tsparticles"
				init={particlesInit}
				options={{
					background: {
						color: {
							value: "rgb(35,39,65)",
						},
						position: "50% 50%",
						repeat: "no-repeat",
						size: "cover",
					},
					fullScreen: {
						zIndex: 1,
					},
					interactivity: {
						events: {
							onClick: {
								enable: true,
								mode: "push",
							},
							onHover: {
								enable: true,
								mode: "grab",
								parallax: {
									enable: true,
									force: 60,
								},
							},
						},
						modes: {
							bubble: {
								distance: 400,
								duration: 2,
								opacity: 0.8,
								size: 40,
								divs: {
									distance: 200,
									duration: 0.4,
									mix: false,
									selectors: [],
								},
							},
							grab: {
								distance: 400,
							},
							repulse: {
								divs: {
									distance: 200,
									duration: 0.4,
									factor: 100,
									speed: 1,
									maxSpeed: 50,
									easing: "ease-out-quad",
									selectors: [],
								},
							},
						},
					},
					particles: {
						color: {
							value: "#ffffff",
						},
						links: {
							color: {
								value: "#ffffff",
							},
							distance: 150,
							enable: true,
							opacity: 0.4,
						},
						move: {
							attract: {
								rotate: {
									x: 600,
									y: 1200,
								},
							},
							enable: true,
							outModes: {
								bottom: "out",
								left: "out",
								right: "out",
								top: "out",
							},
						},
						number: {
							density: {
								enable: true,
							},
						},
						opacity: {
							random: {
								enable: true,
							},
							value: {
								min: 0.1,
								max: 0.5,
							},
							animation: {
								enable: true,
								speed: 3,
								minimumValue: 0.1,
							},
						},
						size: {
							random: {
								enable: true,
							},
							value: {
								min: 0.1,
								max: 10,
							},
							animation: {
								enable: true,
								speed: 20,
								minimumValue: 0.1,
							},
						},
					},
				}}
			/>
			<div className="formContainer">
				<div className="formLogin">全球新闻发布管理系统</div>

				<Form
					name="basic"
					initialValues={{ remember: true }}
					onFinish={onFinish}
					autoComplete="off"
				>
					<Form.Item
						name="Username"
						rules={[{ required: true, message: "Please input your username!" }]}
					>
						<Input placeholder="Username" prefix={<UserAddOutlined />}></Input>
					</Form.Item>

					<Form.Item
						name="password"
						rules={[{ required: true, message: "Please input your password!" }]}
					>
						<Input.Password
							placeholder="Password"
							prefix={<LoginOutlined />}
						></Input.Password>
					</Form.Item>

					<Form.Item
						name="remember"
						valuePropName="checked"
						wrapperCol={{ offset: 8, span: 16 }}
					>
						<Checkbox>记住账号</Checkbox>
					</Form.Item>

					<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
						<Button type="primary" htmlType="submit">
							登录
						</Button>
					</Form.Item>
				</Form>
			</div>
		</div>
	);
}
