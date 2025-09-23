import { Avatar, Button, Col, Divider, Dropdown, Empty, Form, Row, Segmented, Select, Spin } from "antd";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import endpoints from "../utils/endpoints";
import dayjs from "dayjs";
import { DeleteOutlined, EditOutlined, LinkOutlined, LoadingOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import Table from "../components/table";

import config from "../utils/config";
import { useNavigate } from "react-router-dom";
import { Context } from "../utils/context";
import Create from "../components/user/create";
import Update from "../components/user/update";
import Delete from "../components/user/delete";

const Users = () => {
  const { user } = useContext(Context);
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
      .get(endpoints.user.read)
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
      actions: user.is_admin ? (
        <div className="flex justify-end items-center">
          <Button onClick={() => handleOpenUpdate(item)}>
            <EditOutlined /> Editar
          </Button>
          {item.email !== "@master" ? (
            <Button danger className="ml-[10px]" onClick={() => handleOpenDelete(item)}>
              <DeleteOutlined /> Apagar
            </Button>
          ) : null}
        </div>
      ) : null,
    }));

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
        <div className="min-h-[calc(100vh-104px)] bg-[#FFF] p-[40px] rounded-[5px] shadow-lg">
          <div className="flex justify-between items-center">
            <div className="flex justify-center items-center">
              <p className="text-[22px] font-bold">Utilizadores</p>
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
                    title: "Nome",
                    dataIndex: "name",
                    key: "name",
                    width: 400,
                    sort: true,
                    sortType: "text",
                    search: "name",
                  },
                  {
                    title: "E-mail",
                    dataIndex: "email",
                    key: "email",
                    sort: true,
                    sortType: "text",
                    search: "email",
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

export default Users;
