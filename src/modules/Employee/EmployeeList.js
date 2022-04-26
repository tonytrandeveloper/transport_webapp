import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Popconfirm,
  Space,
  Table,

} from "antd";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import Highlighter from "react-highlight-words";
import {
  SearchOutlined,
} from "@ant-design/icons";
import {useSelector} from "react-redux";
import personApi from "../../api/personApi";
import {Link} from "react-router-dom";
import * as links from "../../constants/links"
function EmployeeList(props) {
  const [pagination, setPagination] = useState({ pageSize: 5, current: 1 });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const dataUser = useSelector(
    (state) => state.authReducer.dataUser
  );


  let searchInput;

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
                       setSelectedKeys,
                       selectedKeys,
                       confirm,
                       clearFilters,
                     }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder={`Tìm kiếm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Làm mới
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  useEffect(async () => {
    await getData();
  }, []);

  const getData = async () => {
    let res = await personApi.getAllPerson();
    if (res.status === 200 && Array.isArray(res.data.items)) {
      let resData = res.data.items.map((item, index) => {
        return {...item, key: index};
      });
      setData(resData);
    }
  };

  const handleDelete = async (id) => {
    const res = await personApi.deletePersonById(id);
    await getData();
  };
  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      // sorter: (a, b) => a.name - b.name,
      ...getColumnSearchProps("name"),
      key: "name",
      render: (text, record) =>  {
        return (
          <div>
            <div>{record?.firstName ?? ""}</div>
            <div>{record?.lastName ?? ""}</div>
          </div>
        )
      }
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Link
            to={links.EMPLOYEE_EDIT.replace(':id', record._id)}
          >
            <FiEdit color={"green"} size={"18px"} />
          </Link>
          <Popconfirm
            title="Bạn có muốn xóa?"
            onConfirm={() => handleDelete(record._id)}
          >
            <a>
              <RiDeleteBin6Line color={"red"} size={"18px"} />
            </a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  function onChange(pagination, filters, sorter, extra) {
    setPagination(pagination);
  }

  return (
    <>
      <div>
        <Link
          to={links.EMPLOYEE_NEW}
        >
          <Button
            type="primary"
            onClick={() => {

            }}
          >
            Thêm nhân viên
          </Button>
        </Link>
        <Table
          columns={columns}
          dataSource={data}
          onChange={onChange}
          pagination={pagination}
          loading={loading}
        />
      </div>
    </>
  );
}

EmployeeList.propTypes = {};

export default EmployeeList;
