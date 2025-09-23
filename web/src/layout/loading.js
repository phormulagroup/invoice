import React, { useContext, useState } from "react";
import { Layout, Button, Row, Col, Typography, Form, Input, notification, Spin } from "antd";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import endpoints from "../utils/endpoints";
import config from "../utils/config";
import { LoadingOutlined } from "@ant-design/icons";
import { Context } from "../utils/context";

import logo from "../assets/phormula-logo.svg";

const { Content } = Layout;

export default function Loading() {
  const { event } = useContext(Context);

  return (
    <Layout className="h-full min-h-screen bg-center !bg-cover p-4">
      <Content className="flex justify-center items-center w-full">
        <div className="flex flex-col justify-center items-center h-full">
          <img src={logo} alt="Phormula Logo" className="max-w-[400px] w-full mb-6 mx-auto" />
          <Spin spinning={true} indicator={<LoadingOutlined spin />} />
        </div>
      </Content>
    </Layout>
  );
}
