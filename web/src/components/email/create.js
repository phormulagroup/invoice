import { Row, Col, Button, Input, Select, Radio, Form, notification, Drawer, Switch, ColorPicker, Divider, InputNumber, message } from "antd";
import { useContext, useState } from "react";
import axios from "axios";

import config from "../../utils/config";
import endpoints from "../../utils/endpoints";

function Create({ open, close }) {
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const [form] = Form.useForm();

  function handleSubmit(values) {
    setIsButtonLoading(true);
    axios
      .post(endpoints.email.create, {
        data: values,
      })
      .then((res) => {
        handleCloseDrawer();
        setIsButtonLoading(false);
        form.resetFields();
        message.success("O smtp foi adicionado com sucesso");
      })
      .catch((err) => {
        console.log(err);
        setIsButtonLoading(false);
        message.error("Oops, algo de errado aconteceu, tente novamente");
      });
  }

  function handleCloseDrawer() {
    close();
    setIsButtonLoading(false);
    form.resetFields();
  }

  return (
    <Drawer
      width={700}
      title={"Adicionar SMTP"}
      open={open}
      onClose={handleCloseDrawer}
      maskClosable={false}
      extra={[
        <Button className="mr-2" type="primary" onClick={form.submit} loading={isButtonLoading}>
          Adicionar
        </Button>,
        <Button onClick={close}>Cancelar</Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="domain" label="Domínio" rules={[{ required: true, message: "Este é um campo obrigatório" }]}>
          <Input size="large" placeholder="host.com" />
        </Form.Item>
        <Form.Item className="mt-[24px]" name="name" label="SMTP Nome" rules={[{ required: true, message: "Este é um campo obrigatório" }]}>
          <Input size="large" placeholder="host" />
        </Form.Item>
        <Form.Item className="mt-[24px]" name="host" label="SMTP Host" rules={[{ required: true, message: "Este é um campo obrigatório" }]}>
          <Input size="large" placeholder="mail.host.com" />
        </Form.Item>
        <Form.Item className="mt-[24px]" name="port" label="SMTP Port" rules={[{ required: true, message: "Este é um campo obrigatório" }]}>
          <InputNumber size="large" placeholder="465" />
        </Form.Item>
        <Form.Item label="É seguro?" name="secure" valuePropName="checked">
          <Switch checkedChildren="Sim" unCheckedChildren="Não" />
        </Form.Item>
        <Form.Item className="mt-[24px]" name="email" label="SMTP E-mail" rules={[{ required: true, message: "Este é um campo obrigatório" }]}>
          <Input size="large" placeholder="mail@host.pt" />
        </Form.Item>
        <Form.Item className="mt-[24px]" name="password" label="SMTP Password" rules={[{ required: true, message: "Este é um campo obrigatório" }]}>
          <Input type="password" size="large" placeholder="****" />
        </Form.Item>
      </Form>
    </Drawer>
  );
}

export default Create;
