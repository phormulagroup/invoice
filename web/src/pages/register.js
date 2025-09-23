import React, { useContext, useState } from "react";
import { Layout, Button, Row, Col, Typography, Form, Input, notification, message } from "antd";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import endpoints from "../utils/endpoints";
import config from "../utils/config";

import { Context } from "../utils/context";
import Loading from "../layout/loading";

const { Title } = Typography;
const { Content } = Layout;

export default function Register() {
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [form] = Form.useForm();

  const navigate = useNavigate();

  function handleSubmit(values) {
    console.log(values);
    setIsButtonLoading(true);
    axios
      .post(endpoints.auth.register, {
        data: values,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.registered) {
          navigate("/login");
          setIsButtonLoading(false);
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
                <p className="mb-2 font-bold text-[22px] text-center">Registo</p>
                <Form form={form} onFinish={handleSubmit} layout="vertical" className="row-col">
                  <Form.Item
                    label="Nome"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "Por favor insira o seu nome!",
                      },
                    ]}
                  >
                    <Input size="large" placeholder="E-mail" />
                  </Form.Item>
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
                </Form>
                <Button type="primary" onClick={form.submit} className="w-full mt-4" size="large" loading={isButtonLoading}>
                  Registar
                </Button>
              </Col>
            </Row>
          </Content>
        </Layout>
      )}
    </>
  );
}
