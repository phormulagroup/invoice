import { Form, Row, Col, Modal, Button, Input, message } from "antd";
import axios from "axios";
import endpoints from "../../utils/endpoints";
import { useState } from "react";
import { useContext } from "react";
import { Context } from "../../utils/context";

function SendTest({ data, open, close }) {
  const { messageApi } = useContext(Context);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const [form] = Form.useForm();

  function handleSubmit(values) {
    messageApi.open({ key: "updatable", type: "loading", content: "A enviar e-mail..." });
    axios
      .post(endpoints.email.test, {
        data: { ...data, to: values.email },
      })
      .then((res) => {
        console.log(res);
        messageApi.open({ key: "updatable", type: "success", content: "E-mail enviado com sucesso" });
        form.resetFields();
        close();
      })
      .catch((err) => {
        console.log(err);
        messageApi.open({ key: "updatable", type: "error", content: err.response.data.response });
      });
  }

  function handleClose() {
    form.resetFields();
    close();
  }

  return (
    <Modal
      style={{ top: 60 }}
      width={500}
      id="media-library"
      title={`Enviar teste de SMTP`}
      open={open}
      onCancel={handleClose}
      maskClosable={false}
      footer={[
        <Button disabled={isButtonLoading} onClick={handleClose}>
          Cancelar
        </Button>,
        <Button loading={isButtonLoading} type="primary" onClick={form.submit}>
          Enviar
        </Button>,
      ]}
    >
      <Row gutter={[24]}>
        <Col span={24}>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item name="email" label="E-mail" rules={[{ required: true, message: "Este é um campo obrigatório" }]}>
              <Input type="email" size="large" placeholder="mail@host.pt" />
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Modal>
  );
}

export default SendTest;
