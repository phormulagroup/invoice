import { Button, Col, Empty, Row, Spin } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import endpoints from "../utils/endpoints";

import { DeleteOutlined, EditOutlined, LoadingOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import Table from "../components/table";

import Create from "../components/email/create";
import Update from "../components/email/update";
import Delete from "../components/email/delete";
import config from "../utils/config";

const Email = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [data, setData] = useState([]);
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  useEffect(() => {
    handleGetData();
  }, []);

  function handleGetData() {
    setIsLoading(true);
    axios
      .get(endpoints.email.read)
      .then((res) => {
        console.log(res);
        handlePrepareData(res.data);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }

  function handlePrepareData(arr) {
    let aux = arr.map((item, index) => ({
      key: index,
      img: <div className="bg-center bg-no-repeat bg-contain h-[80px] w-[150px]" style={{ backgroundImage: `url(${config.server_ip}/media/${item.img})` }}></div>,
      domain: item.domain,
      name: item.name,
      host: item.host,
      secure: item.secure,
      email: item.email,
      password: item.password ? "**********" : null,
      actions: (
        <div className="flex justify-end items-center">
          <Button onClick={() => handleOpenUpdate(item)}>
            <EditOutlined /> Editar
          </Button>
          <Button danger className="ml-[10px]" onClick={() => handleOpenDelete(item)}>
            <DeleteOutlined /> Apagar
          </Button>
        </div>
      ),
      full_data: item,
    }));

    setData(arr);
    setTableData(aux);
    setIsLoading(false);
  }

  const handleChange = (pagination, filters, sorter, extra) => {
    setFilteredData(extra.currentDataSource);
  };

  const handleCloseCreate = () => {
    setIsOpenCreate(false);
    handleGetData();
  };

  const handleOpenUpdate = (obj) => {
    setSelectedData(obj);
    setIsOpenUpdate(true);
  };

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedData(null);
    handleGetData();
  };

  const handleOpenDelete = (obj) => {
    setSelectedData(obj);
    setIsOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setSelectedData(null);
    setIsOpenDelete(false);
    handleGetData();
  };

  return (
    <Row className="user-content">
      <Create open={isOpenCreate} close={handleCloseCreate} />
      <Update open={isOpenUpdate} close={handleCloseUpdate} data={selectedData} />
      <Delete open={isOpenDelete} close={handleCloseDelete} data={selectedData} />
      <Col span={24}>
        <div className="max-h-[calc(100vh-104px)] h-full bg-[#FFF] p-[40px] rounded-[5px] shadow-lg">
          <div className="flex justify-between items-center">
            <div className="flex justify-center items-center">
              <p className="text-[22px] font-bold">E-mails</p>
            </div>
            <div className="flex justify-center items-center">
              <Button onClick={handleGetData}>
                <ReloadOutlined /> Atualizar
              </Button>
              <Button onClick={() => setIsOpenCreate(true)} className="ml-[10px]" type="primary">
                <PlusOutlined /> Adicionar
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
                    title: "",
                    dataIndex: "img",
                    key: "img",
                  },
                  {
                    title: "Domínio",
                    dataIndex: "domain",
                    key: "domain",
                    width: 250,
                    filters: data
                      .map((item, index) => ({ text: item.domain, value: item.domain }))
                      .filter((value, index, self) => index === self.findIndex((t) => t.value === value.text)),
                  },
                  {
                    title: "Nome",
                    dataIndex: "name",
                    key: "name",
                  },
                  {
                    title: "Host",
                    dataIndex: "host",
                    key: "host",
                  },
                  {
                    title: "Port",
                    dataIndex: "port",
                    key: "port",
                  },
                  {
                    title: "Secure",
                    dataIndex: "secure",
                    key: "secure",
                  },
                  {
                    title: "E-mail",
                    dataIndex: "email",
                    key: "email",
                  },
                  {
                    title: "Password",
                    dataIndex: "password",
                    key: "password",
                  },
                  {
                    title: "",
                    dataIndex: "actions",
                    key: "actions",
                  },
                ]}
              />
            ) : (
              <Empty description="Sem e-mails" className="mt-[20px]" />
            )}
          </Spin>
        </div>
      </Col>
    </Row>
  );
};

export default Email;
