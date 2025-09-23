import { Avatar, Button, Col, Divider, Dropdown, Empty, Form, Row, Segmented, Select, Spin } from "antd";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import endpoints from "../utils/endpoints";
import dayjs from "dayjs";
import { LinkOutlined, LoadingOutlined, ReloadOutlined } from "@ant-design/icons";
import Table from "../components/table";

import config from "../utils/config";
import { useNavigate } from "react-router-dom";
import { Context } from "../utils/context";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    handleGetData();
  }, []);

  function handleGetData() {
    setIsLoading(true);
    axios
      .get(endpoints.invoice.read)
      .then((res) => {
        console.log(res);
        handlePrepareData(res.data);
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }

  function handlePrepareData(data) {
    let aux = data.map((item, index) => ({
      key: index,
      domain: item.domain,
      name: item.name,
      email: item.email,
      nif: item.nif,
      invoice_id: item.invoice_id,
      link: (
        <a href={item.link} target="_blank" rel="noreferrer" className="text-blue-500">
          <Button>
            <LinkOutlined />
          </Button>
        </a>
      ),
      actions: null,
    }));

    setTableData(aux);
    setIsLoading(false);
  }

  const handleChange = (pagination, filters, sorter, extra) => {
    setFilteredData(extra.currentDataSource);
  };

  return (
    <Row className="user-content">
      <Col span={24}>
        <div className="min-h-[calc(100vh-104px)] bg-[#FFF] p-[40px] rounded-[5px] shadow-lg">
          <div className="flex justify-between items-center">
            <div className="flex justify-center items-center">
              <p className="text-[22px] font-bold">Faturas</p>
            </div>
            <div className="flex justify-center items-center">
              <Button onClick={handleGetData}>
                <ReloadOutlined /> Atualizar
              </Button>
            </div>
          </div>
          <Spin spinning={isLoading} indicator={<LoadingOutlined spin />}>
            {data.length > 0 ? (
              <Table
                dataSource={tableData}
                onChange={handleChange}
                className="mt-[20px]"
                columns={[
                  {
                    title: "Domínio",
                    dataIndex: "domain",
                    key: "domain",
                    filters: data.map((item) => ({ text: item.domain, value: item.domain })),
                  },
                  {
                    title: "Nome",
                    dataIndex: "name",
                    key: "name",
                    width: 250,
                    sort: true,
                    sortType: "text",
                    search: "name",
                  },
                  {
                    title: "E-mail",
                    dataIndex: "email",
                    key: "email",
                    width: 300,
                    sort: true,
                    sortType: "text",
                    search: "email",
                  },
                  {
                    title: "NIF",
                    dataIndex: "nif",
                    key: "nif",
                    sort: true,
                    sortType: "text",
                    search: "nif",
                  },
                  {
                    title: "ID Fatura",
                    dataIndex: "invoice_id",
                    key: "invoice_id",
                    sort: true,
                    sortType: "text",
                    search: "invoice_id",
                  },
                  {
                    title: "Fatura",
                    dataIndex: "link",
                    key: "link",
                  },
                  {
                    title: "",
                    dataIndex: "actions",
                    key: "actions",
                  },
                ]}
              />
            ) : (
              <Empty description="Sem faturas" className="mt-[20px]" />
            )}
          </Spin>
        </div>
      </Col>
    </Row>
  );
};

export default Home;
