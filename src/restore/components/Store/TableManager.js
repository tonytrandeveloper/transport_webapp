import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Popconfirm,
  Space,
  Table,
  Tag,
  Modal,
  Form,
} from "antd";
import tableApi from "../../../api/tableApi";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line,RiCheckboxCircleLine } from "react-icons/ri";
import { GiCancel } from "react-icons/gi";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import {
  TABLE_STATUS_BOOKED,
  TABLE_STATUS_BUSY, TABLE_STATUS_FREE,
  validateMessages
} from "../../../constants/constants";
const ACTION_EDIT = 'Sửa thông tin bàn';
const ACTION_ADD = 'Thêm bàn';

function TableManager(props) {
  const [pagination, setPagination] = useState({pageSize: 5, current: 1});
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [action, setAction] = useState(null);
  const [editId, setEditId] = useState("");

  const [form] = Form.useForm();

  const onFill = (data) => {
    form.setFieldsValue(data[0]);
    setEditId(data[0]._id);
  };

  const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
  };

  const onFinishModal = async (values) => {
    if (action === ACTION_EDIT) {
        await tableApi.editTableById(editId, values);
      } else {
        await tableApi.createTable({...values});
      }
      await getData();
      setIsModalVisible(false);
    }

    const showModal = (type) => {
      setAction(type);
      setIsModalVisible(true);
    };

    const handleOkModal = () => {
      setIsModalVisible(false);
      setAction(null);
    };

    const handleCancelModal = () => {
      setIsModalVisible(false);
      setAction(null);
    };

    let searchInput;

    const getColumnSearchProps = (dataIndex) => ({
      filterDropdown: ({
                         setSelectedKeys,
                         selectedKeys,
                         confirm,
                         clearFilters,
                       }) => (
        <div style={{padding: 8}}>
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
            style={{width: 188, marginBottom: 8, display: "block"}}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined/>}
              size="small"
              style={{width: 90}}
            >
              Tìm kiếm
            </Button>
            <Button
              onClick={() => handleReset(clearFilters)}
              size="small"
              style={{width: 90}}
            >
              Làm mới
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{color: filtered ? "#1890ff" : undefined}}/>
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
            highlightStyle={{backgroundColor: "#ffc069", padding: 0}}
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
      let res = await tableApi.getAllTable();
      if (res.status === 200) {
        setData(res.data);
      }
    };

    const handleDelete = async (id) => {
      const res = await tableApi.deleteTableById(id);
      await getData();
    };
    const handleStatus = async (id, status) => {
      const res = await tableApi.setStatusById(id, status);
      await getData();
    };
    const columns = [
      {
        title: "Tên",
        dataIndex: "name",
        sorter: (a, b) => a.name.length - b.name.length,
        ...getColumnSearchProps("name"),
      },
      {
        title: "Mô tả",
        dataIndex: "description",
        sorter: (a, b) => a.description.length - b.description.length,
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        filters: [
          {
            text: "Được đặt",
            value: "booked",
          },
          {
            text: "Rảnh",
            value: "free",
          },
          {
            text: "Đang bận",
            value: "busy",
          },
        ],
        onFilter: (value, record) => record.status === value,
        sorter: (a, b) => a.status?.length - b.status?.length,
        render: (status) => {
          let color;
          let valueVN;
          switch (status) {
            case TABLE_STATUS_BUSY:
              color = "red";
              valueVN = "Đang bận";
              break;
            case TABLE_STATUS_FREE:
              color = "blue";
              valueVN = "Rảnh";
              break;
            case TABLE_STATUS_BOOKED:
              color = "green";
              valueVN = "Được đặt";
              break;
          }
          return (
            <Tag color={color} key={status}>
              {valueVN}
            </Tag>
          );
        },
      },
      {
        title: "Hành động",
        key: "action",
        render: (text, record) => (
          <Space size="middle">
            <Popconfirm
              title="Cập nhật trạng thái rảnh?"
              onConfirm={() => handleStatus(record._id, "free")}
            >
              <a>

                <RiCheckboxCircleLine color={"blue"} size={"19px"}/>
              </a>
            </Popconfirm>
            <Popconfirm
              title="Cập nhật trạng thái bận?"
              onConfirm={() => handleStatus(record._id, "busy")}
            >
              <a>
                <GiCancel color={"red"} size={"19px"}/>
              </a>
            </Popconfirm>
            <a
              onClick={() => {
                form.resetFields();
                onFill(data.filter((item) => item._id == record._id));
                showModal(ACTION_EDIT);
              }}
            >
              <FiEdit color={"green"} size={"18px"}/>
            </a>
            <Popconfirm
              title="Bạn có muốn xóa?"
              onConfirm={() => handleDelete(record._id)}
            >
              <a>
                <RiDeleteBin6Line color={"red"} size={"18px"}/>
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
          <Button
            type="primary"
            onClick={() => {
              form.resetFields();
              showModal(ACTION_ADD);
            }}
            style={{
              marginBottom: "16px",
              backgroundColor: '#53382c',
              borderColor: '#53382c'
            }}
          >
            Thêm bàn
          </Button>
          <Modal
            footer={null}
            title={action}
            visible={isModalVisible}
            onOk={handleOkModal}
            onCancel={handleCancelModal}
          >
            <Form
              {...layout}
              name="nest-messages"
              onFinish={onFinishModal}
              validateMessages={validateMessages}
              form={form}
            >
              <Form.Item name={"name"} label="Tên" rules={[{required: true}]}>
                <Input/>
              </Form.Item>
              <Form.Item name={"description"} label="Mô tả">
                <TextArea rows="5"/>
              </Form.Item>
              <Form.Item wrapperCol={{...layout.wrapperCol, offset: 8}}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    backgroundColor: '#53382c',
                    borderColor: '#53382c'
                  }}
                >
                  Lưu
                </Button>
              </Form.Item>
            </Form>
          </Modal>
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

  TableManager.propTypes = {};

  export default TableManager;
