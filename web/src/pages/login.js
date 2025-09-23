import React, { useContext, useState } from "react";
import { Layout, Button, Row, Col, Typography, Form, Input, notification, message } from "antd";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import endpoints from "../utils/endpoints";
import config from "../utils/config";

import { Context } from "../utils/context";
import Loading from "../layout/loading";

import logo from "../assets/phormula-logo.svg";

const { Title } = Typography;
const { Content } = Layout;

export default function Login() {
  const { handleLogin } = useContext(Context);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [form] = Form.useForm();

  function handleSubmit(values) {
    setIsButtonLoading(true);
    axios
      .post(endpoints.auth.login, {
        data: values,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.user) {
          message.success(`Login efetuado com sucesso, bem-vindo ${res.data.user.name}!`);
          localStorage.setItem("token", res.data.token);
          handleLogin(res.data);
        } else {
          setIsButtonLoading(false);
          message.error(res.data.message);
        }
      })
      .catch((err) => {
        setIsButtonLoading(false);
        console.log(err);
        message.error("Alguma coisa de errado aconteceu, tente novamente mais tarde!");
      });
  }

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <Layout className="h-full min-h-screen bg-center !bg-cover p-4">
          <Content className="signin flex justify-center items-center w-full">
            <Row className="flex justify-center items-center h-full w-full">
              <Col xs={24} sm={20} md={18} lg={12} className="bg-[#FFFFFF] p-8 rounded-[5px] shadow-lg">
                <img src={logo} alt="Phormula Logo" className="w-[200px] mb-4 mx-auto" />
                <p className="mb-2 font-bold text-[22px] text-center">Login</p>
                <p className="text-center text-[16px] mb-4">Insira o seu e-mail e password para fazer login</p>
                <Form form={form} onFinish={handleSubmit} layout="vertical" className="row-col">
                  <Form.Item
                    label="E-mail"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Por favor insira o seu e-mail!",
                      },
                    ]}
                  >
                    <Input size="large" placeholder="E-mail" />
                  </Form.Item>
                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Por favor insira a sua password!",
                      },
                    ]}
                  >
                    <Input.Password size="large" placeholder="Password" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" className="w-full" size="large" loading={isButtonLoading}>
                      Entrar
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </Content>
        </Layout>
      )}
    </>
  );
}
