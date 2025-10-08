import { Layout, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import logo from "../assets/phormula-logo.svg";

const { Content } = Layout;

export default function Loading() {
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
