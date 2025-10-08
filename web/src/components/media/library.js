import { Form, Row, Col, Radio, Empty, Button, Pagination, Tooltip, Input, Spin } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import customParseFormat from "dayjs/plugin/customParseFormat";

import endpoints from "../../utils/endpoints";

import config from "../../utils/config";
import { FaFilePdf, FaFilePowerpoint } from "react-icons/fa";

dayjs.extend(customParseFormat);

function Library({ mediaKey, option, close }) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(24);

  const [form] = Form.useForm();

  useEffect(() => {
    if (option === "Biblioteca") handleGetData();
  }, [option, mediaKey]);

  function handleGetData() {
    setIsLoading(true);
    axios
      .get(endpoints.media.read)
      .then((res) => {
        setData(res.data);
        setFilteredData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }

  function handleSubmit(values) {
    form.resetFields();
    close(values);
  }

  function handleChangePage(e, p) {
    setItemsPerPage(p);
    setCurrentPage(e);
    if (e <= 1) {
      setMinValue(0);
      setMaxValue(p);
    } else {
      let newMinValue = p * (e - 1);
      let newMaxValue = newMinValue + p;
      setMinValue(newMinValue);
      setMaxValue(newMaxValue);
    }
  }

  function handleSearch(e, all) {
    if (e.search) {
      const auxNewData = JSON.parse(JSON.stringify(data));
      let searchedData = auxNewData.filter((item) => item.name.toLowerCase().includes(e.search.toLowerCase()));
      setFilteredData(searchedData);
    } else {
      setFilteredData(data);
    }
  }

  return (
    <Spin spinning={isLoading} indicator={<LoadingOutlined spin />}>
      <Row gutter={[24]} className="mt-4">
        <Col span={24}>
          {data.length > 0 ? (
            <Form form={form} onFinish={handleSubmit} onValuesChange={handleSearch}>
              <Form.Item name="search">
                <Input size="large" placeholder="Procure aqui pelo nome da imagem..." prefix={<SearchOutlined />} allowClear />
              </Form.Item>
              <Form.Item name={mediaKey}>
                <Radio.Group buttonStyle="solid" className="w-full">
                  <div className="grid grid-cols-4 gap-4">
                    {filteredData.slice(minValue, maxValue).map((item) => {
                      return (
                        <div className="radio-library mb-2">
                          <Radio.Button value={item.name} className="w-full min-h-[100px]">
                            <div className="flex flex-col justify-center items-center h-full">
                              {item.name.split(".")[1] === "pdf" ? (
                                <Tooltip placement="bottom" title={item.name}>
                                  <FaFilePdf className="text-[40px]" />
                                </Tooltip>
                              ) : item.name.split(".")[1] === "pptx" ? (
                                <Tooltip placement="bottom" title={item.name}>
                                  <FaFilePowerpoint className="text-[40px]" />
                                </Tooltip>
                              ) : (
                                <Tooltip placement="bottom" title={item.name}>
                                  <div
                                    className="bg-center bg-no-repeat bg-contain min-h-[100px] w-full"
                                    style={{ backgroundImage: `url(${config.server_ip}/media/${item.name})` }}
                                  ></div>
                                </Tooltip>
                              )}
                            </div>
                          </Radio.Button>
                        </div>
                      );
                    })}
                  </div>
                </Radio.Group>
              </Form.Item>
            </Form>
          ) : (
            <Empty description="Sem imagens" className="mt-4" />
          )}
        </Col>
        {data.length > 0 ? (
          <div className="flex justify-center items-center mt-4 w-full">
            <Pagination onChange={handleChangePage} pageSize={itemsPerPage} defaultCurrent={1} current={currentPage} total={data.length} />
          </div>
        ) : null}
        {data.length > 0 ? (
          <Col span={24} align="center" className="mt-[20px]">
            <Button className="mr-2" onClick={() => close()}>
              Cancelar
            </Button>
            <Button type="primary" onClick={form.submit}>
              Escolher
            </Button>
          </Col>
        ) : null}
      </Row>
    </Spin>
  );
}

export default Library;
