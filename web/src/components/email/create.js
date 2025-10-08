import { Button, Input, Form, Drawer, Switch, InputNumber, message } from "antd";
import { useState } from "react";
import axios from "axios";
import { DeleteOutlined, FileImageOutlined } from "@ant-design/icons";

import Media from "../media/media";

import config from "../../utils/config";
import endpoints from "../../utils/endpoints";

function Create({ open, close }) {
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isOpenMedia, setIsOpenMedia] = useState(false);

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

  function handleOpenModalMedia() {
    setIsOpenMedia(true);
  }

  function handleCloseMedia(response) {
    if (response) {
      form.setFieldValue("img", response["img"]);
    }

    setIsOpenMedia(false);
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
      <Media mediaKey={"img"} open={isOpenMedia} close={handleCloseMedia} />
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues !== currentValues}>
          {({ getFieldValue }) => (
            <>
              <p className="mb-[8px] mt-0 text-[14px]">Imagem</p>
              <div
                className="bg-no-repeat bg-center bg-contain border-dashed border-[2px] rounded-[5px] cursor-pointer min-h-[150px]"
                onClick={handleOpenModalMedia}
                style={{ backgroundImage: `url(${config.server_ip}/media/${getFieldValue("img")})` }}
              >
                {!getFieldValue("img") ? (
                  <div className="flex justify-center items-center flex-col p-10">
                    <FileImageOutlined className="text-[30px]" />
                    <p className="text-[12px] mb-0 mt-2 text-center">Clique aqui para adicionar uma imagem</p>
                  </div>
                ) : null}
              </div>

              <Form.Item name="img" hidden>
                <Input />
              </Form.Item>
              {getFieldValue("img") ? (
                <div className="flex justify-between mt-2">
                  <p>{getFieldValue("img")}</p>
                  <DeleteOutlined onClick={() => form.setFieldValue("img", null)} />
                </div>
              ) : null}
            </>
          )}
        </Form.Item>
        <Form.Item className="mt-[24px]" name="domain" label="Domínio" rules={[{ required: true, message: "Este é um campo obrigatório" }]}>
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
