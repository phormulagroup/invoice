import { Form, Row, Col, Modal, Segmented } from "antd";
import { useEffect, useState } from "react";

import Library from "./library";
import Upload from "./upload";

function Media({ mediaKey, open, close }) {
  const [optionSelected, setOptionSelected] = useState("Biblioteca");

  function handleClose(value) {
    close(value);
  }

  function handleChangeSegment(value) {
    setOptionSelected(value);
  }

  return (
    <Modal style={{ top: 20 }} width={1000} id="media-library" title={`Biblioteca de multimédia`} open={open} onCancel={() => handleClose()} maskClosable={false} footer={[]}>
      <Row gutter={[24]}>
        <Col span={24}>
          <Segmented size="large" options={["Biblioteca", "Upload"]} value={optionSelected} onChange={handleChangeSegment} block />
          {optionSelected === "Biblioteca" ? <Library mediaKey={mediaKey} option={optionSelected} close={handleClose} /> : <Upload />}
        </Col>
      </Row>
    </Modal>
  );
}

export default Media;
