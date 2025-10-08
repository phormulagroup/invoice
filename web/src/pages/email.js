import { Button, Col, Dropdown, Empty, Row, Spin } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import endpoints from "../utils/endpoints";

import {
  BoxPlotOutlined,
  CheckCircleFilled,
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  LoadingOutlined,
  PlusOutlined,
  ReloadOutlined,
  SendOutlined,
} from "@ant-design/icons";
import Table from "../components/table";

import Create from "../components/email/create";
import Update from "../components/email/update";
import Delete from "../components/email/delete";
import config from "../utils/config";
import { FaSquare } from "react-icons/fa";
import { FaSquareCheck, FaRegSquare } from "react-icons/fa6";
import SendTest from "../components/email/sendTest";
import { useContext } from "react";
import { Context } from "../utils/context";

const Email = () => {
  const { messageApi } = useContext(Context);
  const [isLoading, setIsLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [data, setData] = useState([]);
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenSendTest, setIsOpenSendTest] = useState(false);
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
      img: <div className="bg-center bg-no-repeat bg-contain h-[80px] w-[68px]" style={{ backgroundImage: `url(${config.server_ip}/media/${item.img})` }}></div>,
      domain: item.domain,
      name: item.name,
      host: item.host,
      port: item.port,
      secure: item.secure ? <CheckCircleFilled className="text-green-600" /> : <CheckCircleFilled className="text-[#c1c1c1]" />,
      email: item.email,
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
      actions: (
        <div className="flex justify-end items-center">
          <Button onClick={() => handleOpenUpdate(item)}>
            <EditOutlined /> Editar
          </Button>
          {!item.is_default ? (
            <Button danger className="ml-[10px]" onClick={() => handleOpenDelete(item)}>
              <DeleteOutlined /> Apagar
            </Button>
          ) : null}
          <Dropdown
            className="ml-[10px]"
            menu={{
              items: [
                {
                  label: "Enviar teste",
                  key: `${item.id}-send-test`,
                  icon: <SendOutlined />,
                  onClick: () => handleOpenSendTest(item),
                },
                {
                  label: item.is_default ? "Marcado como default" : "Marcar como default",
                  key: `${item.id}-is_default`,
                  icon: item.is_default ? <FaSquareCheck /> : <FaRegSquare />,
                  onClick: () => handleSetDefault(item),
                },
              ],
            }}
          >
            <Button>
              <EllipsisOutlined />
            </Button>
          </Dropdown>
        </div>
      ),
      full_data: item,
    }));

    setData(arr);
    setTableData(aux);
    setIsLoading(false);
  }

  function handleSetDefault(item) {
    axios
      .post(endpoints.email.default, {
        data: item,
      })
      .then((res) => {
        console.log(res);
        messageApi.open({ type: "success", content: `${item.name} marcado como default` });
        handleGetData();
      })
      .catch((err) => {
        console.log(err);
        messageApi.open({ type: "error", content: err.message });
      });
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

  const handleOpenSendTest = (obj) => {
    setSelectedData(obj);
    setIsOpenSendTest(true);
  };

  const handleCloseSendTest = () => {
    setSelectedData(null);
    setIsOpenSendTest(false);
    handleGetData();
  };

  return (
    <Row className="user-content">
      <Create open={isOpenCreate} close={handleCloseCreate} />
      <Update open={isOpenUpdate} close={handleCloseUpdate} data={selectedData} />
      <Delete open={isOpenDelete} close={handleCloseDelete} data={selectedData} />
      <SendTest open={isOpenSendTest} close={handleCloseSendTest} data={selectedData} />
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
                    width: 100,
                  },
                  {
                    title: "Domínio",
                    dataIndex: "domain",
                    key: "domain",
                    width: 200,
                    filters: data
                      .map((item, index) => ({ text: item.domain, value: item.domain }))
                      .filter((value, index, self) => index === self.findIndex((t) => t.value === value.text)),
                  },
                  {
                    title: "Nome",
                    dataIndex: "name",
                    width: 200,
                    key: "name",
                  },
                  {
                    title: "Host",
                    dataIndex: "host",
                    key: "host",
                    sort: true,
                    sortType: "text",
                    search: "host",
                  },
                  {
                    title: "Port",
                    dataIndex: "port",
                    width: 90,
                    key: "port",
                  },
                  {
                    title: "Secure",
                    dataIndex: "secure",
                    width: 90,
                    key: "secure",
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
              <Empty description="Sem e-mails" className="mt-[20px]" />
            )}
          </Spin>
        </div>
      </Col>
    </Row>
  );
};

export default Email;
