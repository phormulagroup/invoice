import { Row, Col, Button, Input, Select, Radio, Form, notification, Drawer, Switch, ColorPicker, Divider, InputNumber, message } from "antd";
import { useContext, useEffect, useState } from "react";
import axios from "axios";

import config from "../../utils/config";
import endpoints from "../../utils/endpoints";

function Update({ data, open, close }) {
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    if (data && open) {
      console.log(data);
      form.setFieldsValue(data);
    }
  }, [data]);

  function handleSubmit(values) {
    setIsButtonLoading(true);
    axios
      .post(endpoints.user.update, {
        data: values,
      })
      .then((res) => {
        handleCloseDrawer();
        setIsButtonLoading(false);
        form.resetFields();
        message.success("O utilizador foi editado com sucesso");
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
      title={"Editar utilizador"}
      open={open}
      onClose={handleCloseDrawer}
      maskClosable={false}
      extra={[
        <Button className="mr-2" type="primary" onClick={form.submit} loading={isButtonLoading}>
          Editar
        </Button>,
        <Button onClick={close}>Cancelar</Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item className="mt-[24px]" name="name" label="Nome" rules={[{ required: true, message: "Este é um campo obrigatório" }]}>
          <Input size="large" placeholder="Jonh Doe" />
        </Form.Item>
        <Form.Item name="email" label="E-mail" rules={[{ required: true, message: "Este é um campo obrigatório" }]}>
          <Input size="large" placeholder="exemplo@mail.pt" type="email" />
        </Form.Item>
        <Form.Item name="new_password" label="Password">
          <Input type="password" size="large" placeholder="****" />
        </Form.Item>
        <Form.Item label="É administrador?" name="is_admin" valuePropName="checked">
          <Switch checkedChildren="Sim" unCheckedChildren="Não" />
        </Form.Item>
      </Form>
    </Drawer>
  );
}

export default Update;
