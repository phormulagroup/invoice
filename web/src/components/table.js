import { Button, Input, Space, Table } from "antd";

import { useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

const CustomTable = (props) => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters, confirm) => {
    clearFilters();
    setSearchText("");
    confirm();
  };

  const getColumnSearchProps = (dataIndex) =>
    dataIndex
      ? {
          filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
              style={{
                padding: 10,
                position: "relative",
              }}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <Input
                size="large"
                ref={searchInput}
                placeholder={`Procurar...`}
                value={selectedKeys[0]}
                onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                style={{
                  marginBottom: 8,
                  display: "block",
                }}
              />
              <Space>
                <Button type="primary" onClick={() => handleSearch(selectedKeys, confirm, dataIndex)} icon={<SearchOutlined />}>
                  Search
                </Button>
                <Button
                  onClick={() => clearFilters && handleReset(clearFilters, confirm)}
                  style={{
                    width: 90,
                  }}
                >
                  Reset
                </Button>
              </Space>
            </div>
          ),
          filterIcon: (filtered) => (
            <SearchOutlined
              style={{
                color: filtered ? "#1677ff" : undefined,
              }}
            />
          ),
          onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
          filterDropdownProps: {
            onOpenChange(open) {
              if (open) {
                setTimeout(() => searchInput.current?.select(), 100);
              }
            },
          },

          render: (text) =>
            searchedColumn === dataIndex ? (
              <Highlighter highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }} searchWords={[searchText]} autoEscape textToHighlight={text ? text.toString() : ""} />
            ) : (
              text
            ),
        }
      : null;

  return (
    <Table
      onChange={props.onChange}
      className={props.className}
      dataSource={props.dataSource}
      pagination={{ position: ["none", "bottomCenter"] }}
      scroll={{ y: 120 * 5, x: "max-content" }}
      columns={props.columns.map((item) => ({
        title: item.title,
        dataIndex: item.dataIndex,
        key: item.key,
        width: item.width,
        filters: item.filters,
        onFilter: (value, record) =>
          record.full_data ? record.full_data[item.dataIndex].toLowerCase() === value.toLowerCase() : record[item.dataIndex].toLowerCase() === value.toLowerCase(),
        sorter:
          item.sort && (item.sortType === "text" || item.sortType === "number")
            ? (a, b) => {
                if (item.sortType === "text") return a[item.dataIndex].localeCompare(b[item.dataIndex]);
                else return a[item.dataIndex] - b[item.dataIndex];
              }
            : item.sortType === "date"
            ? (a, b) => {
                console.log(b[item.dataIndex]);
                return new Date(b.full_data[item.dataIndex]) - new Date(a.full_data[item.dataIndex]);
              }
            : null,
        ...getColumnSearchProps(item.search),
      }))}
    />
  );
};

export default CustomTable;
