import React, { useContext, useState } from "react";
import { Button, Col, Row, Modal } from "antd";
import axios from "axios";

import endpoints from "../../utils/endpoints";

import "react-quill/dist/quill.snow.css";
import { Context } from "../../utils/context";

function Delete({ data, open, close }) {
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  function handleSubmit() {
    setIsButtonLoading(true);
    axios
      .post(endpoints.user.delete, {
        data,
      })
      .then((res) => {
        setTimeout(() => {
          setIsButtonLoading(false);
          close();
        }, 1000);
      })
      .catch((error) => {
        setIsButtonLoading(false);
        console.error(error);
      });
  }

  return (
    <Modal
      key="delete-modal"
      width={800}
      style={{ top: 60 }}
      onCancel={close}
      open={open}
      title={"Apagar utilizador"}
      footer={[
        <Button disabled={isButtonLoading} onClick={close}>
          Cancelar
        </Button>,
        <Button loading={isButtonLoading} type="primary" onClick={handleSubmit}>
          Apagar
        </Button>,
      ]}
    >
      <Row>
        <Col span={24}>
          <p className="text-[16px] font-bold">Tem a certeza que quer apagar?</p>
          <p className="text-[16px] mt-2 mb-0">{data?.name}</p>
        </Col>
      </Row>
    </Modal>
  );
}

export default Delete;
