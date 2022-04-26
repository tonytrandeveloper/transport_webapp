import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Popconfirm,
  Space,
  Table,
  Modal,
  Form,
  Select,
} from "antd";
import exportMaterialApi from "../../../api/exportMaterialApi";
import materialApi from "../../../api/materialApi";
import { RiDeleteBin6Line } from "react-icons/ri";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import {validateMessages} from "../../../constants/constants";
const { Option } = Select;

const ACTION_ADD = "Thêm đơn xuất nguyên liệu";
const ACTION_EDIT = "Sửa thông tin xuất nguyên liệu";
function ExportMaterialManager(props) {
  const [pagination, setPagination] = useState({ pageSize: 5, current: 1 });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [action, setAction] = useState("Sửa thông tin");
  const [editId, setEditId] = useState("");
  const [dataMenu, setDataMenu] = useState([]);
  const [dataMaterial, setDataMaterial] = useState([]);

  const [form] = Form.useForm();
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const onFinishModal = async (values) => {
    let exportMaterial = Object.keys(values).map((item, index) => {
      return values[item];
    });
    let newExportMaterial = [];
    for (let i = 1; i < exportMaterial.length; i += 2) {
      newExportMaterial.push({
        material: exportMaterial[i],
        amount: exportMaterial[i + 1],
      });
    }
    let newValues = { ...values, export: [...newExportMaterial] };
    if (action === ACTION_EDIT) {
      await exportMaterialApi.editExportMaterialById(editId, values);
    } else {
      await exportMaterialApi.createExportMaterial(newValues);
    }
    await getData();
    setIsModalVisible(false);
  };
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
  const addMenu = () => {
    let newDataMenu = [...dataMenu];
    newDataMenu.push("1");
    setDataMenu(newDataMenu);
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
    await getDataMaterial();
  }, []);
  const getDataMaterial = async () => {
    let res = await materialApi.getAllMaterial();
    if (res.status === 200) {
      setDataMaterial(res.data);
    }
  };
  const getData = async () => {
    let res = await exportMaterialApi.getAllExportMaterial();
    if (res.status === 200) {
      let resData = res.data.map((item, index) => {
        return {
          ...item,
          key: index,
        };
      });
      setData(resData);
    }
  };
  const handleDelete = async (id) => {
    const res = await exportMaterialApi.deleteExportMaterialById(id);
    if (res.status === 200) {
      await getData();
    }
  };
  const columns = [
    {
      title: "Tên đơn xuất",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name?.length - b.name?.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Thời gian",
      dataIndex: "updatedAt",
      key: "updatedAt",
      sorter: (a, b) => a.updatedAt?.length - b.updatedAt?.length,
      render: (text, record) => {
        return new Date(record.updatedAt).toLocaleString();
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
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
  const columnsRow = [
    {
      title: "Tên nguyên liệu",
      dataIndex: "name",
      sorter: (a, b) => a.name?.length - b.name?.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Số lượng",
      dataIndex: "amount",
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "Đơn vị",
      dataIndex: "unit",
      sorter: (a, b) =>a.unit?.length - b.unit?.length,
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
            setDataMenu([]);
            showModal(ACTION_ADD);
          }}
          style={{
            marginBottom: "16px",
            backgroundColor: '#53382c',
            borderColor: '#53382c'
          }}
        >
          Thêm đơn xuất nguyên liệu
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
            onValuesChange={(values, data) => {
              console.log(data);
            }}
            validateMessages={validateMessages}
            form={form}
          >
            <Form.Item name={"name"} label="Tên">
              <Input />
            </Form.Item>
            {dataMenu.map((item, index) => {
              return (
                <div
                  key={index}
                  className="itemMenu"
                  style={{
                    bexportMaterialBottom: "1px solid #000",
                    padding: "8px 0px",
                    marginBottom: "8px",
                  }}
                >
                  <Form.Item
                    key={index}
                    name={"material." + index}
                    label={
                      "Nguyên liệu" +
                      (dataMenu.length > 1 ? " " + (index + 1) : "")
                    }
                  >
                    <Select placeholder="Chọn nguyên liệu" allowClear>
                      {dataMaterial.map((item, index) => {
                        return <Option value={item._id}>{item.name}</Option>;
                      })}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name={"amount." + index}
                    label="Số lượng"
                    rules={[{ number: "range", min: 0 }]}
                  >
                    <Input type="number" min="0" />
                  </Form.Item>
                </div>
              );
            })}
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <Button
                htmlType="button"
                onClick={() => addMenu()}
                style={{
                  backgroundColor: '#53382c',
                  borderColor: '#53382c',
                  color: '#fff'
                }}
              >
                Thêm nguyên liệu xuất
              </Button>
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
          expandable={{
            expandedRowRender: (record) => {
              let dataSourceRow = record.export.map((item, index) => {
                return {
                  ...item.material,
                  amount: item.amount,
                  totalPrice: item.amount * item.material.priceperunit,
                  priceperunit: item.material.priceperunit,
                  key: index,
                };
              });
              return <Table columns={columnsRow} dataSource={dataSourceRow} />;
            },
            rowExpandable: (record) => record.name !== "Not Expandable",
          }}
        />
      </div>
    </>
  );
}

ExportMaterialManager.propTypes = {};

export default ExportMaterialManager;
