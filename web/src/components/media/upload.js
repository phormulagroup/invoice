import { Form, Row, Col, message } from "antd";
import { useState } from "react";
import axios from "axios";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";

import endpoints from "../../utils/endpoints";
import config from "../../utils/config";
import upload from "../../utils/upload";

function Upload({ open, close, key }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const [form] = Form.useForm();

  const props = {
    accept: "image/png, image/jpeg, .svg",
    name: "file",
    multiple: true,
    action: config.server_ip + endpoints.media.singleUpload,
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    beforeUpload: (file) => {
      console.log(file);
      return new Promise(async (resolve, reject) => {
        try {
          let compressedFile = await upload.compress(file);
          console.log(compressedFile);
          resolve(compressedFile);
        } catch (err) {
          console.log(err);
          reject(false);
        }
      });
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  function handleUploadMedia() {
    setIsButtonLoading(true);
    let formData = new FormData();

    fileList.forEach((file) => {
      formData.append("file", file);
    });

    axios
      .post(endpoints.media.upload, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setFileList([]);
      })
      .catch((err) => {
        console.log(err);
        setIsButtonLoading(false);
      });
  }

  return (
    <Row gutter={[24]} className="mt-4">
      <Col span={24}>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned files.</p>
        </Dragger>
      </Col>
    </Row>
  );
}

export default Upload;
