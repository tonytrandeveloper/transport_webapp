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
import materialApi from "../../../api/materialApi";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import {ROLE_ADMIN, ROLE_CASHIER, validateMessages} from "../../../constants/constants";

const ACTION_EDIT = 'Sửa thông tin nguyên liệu';
const ACTION_ADD = 'Thêm nguyên liệu';

function MaterialManager(props) {
  const [pagination, setPagination] = useState({ pageSize: 5, current: 1 });
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
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const onFinishModal = async (values) => {
    console.log(values);
    if (action === ACTION_EDIT) {
      await materialApi.editMaterialById(editId, values);
    } else {
      await materialApi.createMaterial({ ...values });
    }
    await getData();
    setIsModalVisible(false);
  }
    ;

  const showModal = (type) => {
    setAction(type);
    setIsModalVisible(true);
  };

  const handleOkModal = () => {
    setIsModalVisible(false);
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
  };

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
            làm mới
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
    let res = await materialApi.getAllMaterial();
    if (res.status === 200) {
      setData(res.data);
    }
  };

  const handleDelete = async (id) => {
    const res = await materialApi.deleteMaterialById(id);
    await getData();
  };

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      sorter: (a, b) => a.name?.length - b.name?.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Loại",
      dataIndex: "name_type",
      sorter: (a, b) => a.name_type?.length - b.name_type?.length,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      sorter: (a, b) => a.description?.length - b.description?.length,
    },
    {
      title: "Số lượng",
      dataIndex: "amount",
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "Đơn vị",
      dataIndex: "unit",
      sorter: (a, b) => a.unit?.length - b.unit?.length,
    },
    {
      title: "Giá trên đơn vị 1000 VND",
      dataIndex: "priceperunit",
      render: (priceperunit) => {
        return <div>
          {priceperunit ? new Intl.NumberFormat().format(priceperunit*1000) : ""} VND
        </div>
      },
      sorter: (a, b) => a.priceperunit?.length - b.priceperunit?.length,
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <a
            onClick={() => {
              form.resetFields();
              onFill(data.filter((item) => item._id == record._id));
              showModal(ACTION_EDIT);
            }}
          >
            <FiEdit color={"green"} size={"18px"} />
          </a>

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
          Thêm nguyên liệu
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
            <Form.Item name={"name"} label="Tên" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={"name_type"} label="Loại" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={"amount"} label="Số lượng" rules={[{ required: true }]}>
              <Input type="number" min="0" />
            </Form.Item>
            <Form.Item name={"unit"} label="Đơn vị" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={"priceperunit"} label="Giá trên đơn vị 1000 VND" rules={[{ required: true }]}>
              <Input type="number" min="0" />
            </Form.Item>
            <Form.Item name={"description"} label="Mô tả">
              <TextArea rows="5" />
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
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

MaterialManager.propTypes = {};

export default MaterialManager;
