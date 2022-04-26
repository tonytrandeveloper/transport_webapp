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
  Select,
  Upload,
} from "antd";
import productApi from "../../../api/productApi";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import Highlighter from "react-highlight-words";
import {
  LoadingOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import typeProductApi from "../../../api/typeProductApi";
import {beforeUpload, getBase64} from "../../../functions/functions";
import {LINK_DIRECTORY_FILES, LINK_UPLOAD_PHOTO, validateMessages} from "../../../constants/constants";
const { Option } = Select;

const ACTION_EDIT = 'Sửa thông tin sản phẩm';
const ACTION_ADD = 'Thêm sản phẩm';

function ProductManager(props) {
  const [pagination, setPagination] = useState({ pageSize: 5, current: 1 });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [action, setAction] = useState(null);
  const [editId, setEditId] = useState("");
  const [dataOption, setDataOption] = useState([]);
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [fileList, setFileList] = useState([]);

  const [form] = Form.useForm();

  const handleChangeAvatar = (info) => {
    setFileList(info.fileList);
    if (info.file.status === "uploading") {
      setLoadingPhoto(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (imageUrl) => {
        setImageUrl(info.file.response.photo);
        setLoadingPhoto(false);
      });
      console.log(info.file.response);
    }
  };

  const uploadButton = (
    <div>
      {loadingPhoto ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const onFill = (data) => {
    form.setFieldsValue(data[0]);
    if (data[0].photo) setImageUrl(data[0].photo);
    setEditId(data[0]._id);
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const onFinishModal = async (values) => {
    console.log(values);
    if (action === ACTION_EDIT) {
      await productApi.editProductById(editId, { ...values, photo: imageUrl });
    } else {
      await productApi.createProduct({ ...values, photo: imageUrl });
    }
    await getData();
    setIsModalVisible(false);
    setImageUrl(null);
    setAction(null);
  };

  const showModal = (type) => {
    setAction(type);
    setIsModalVisible(true);
  };

  const handleOkModal = () => {
    setIsModalVisible(false);
    setImageUrl(null);
    setAction(null);
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
    setImageUrl(null);
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
    await getDataOption();
  }, []);

  const getDataOption = async () => {
    let res = await typeProductApi.getAllTypeProduct();
    if (res.status === 200) {
      setDataOption(res.data);
    }
  };

  const getData = async () => {
    let res = await productApi.getAllProduct();
    if (res.status === 200) {
      res = res.data;
      let resData = res.map((item, index) => {
        return {
          ...item,
          type: item.type._id,
          typeName: item.type.name,
          key: index,
        };
      });
      console.log(res);
      if (res.photo) setImageUrl(res.photo);
      setData(resData);
    }
  };

  const handleDelete = async (id) => {
    console.log(id);
    const res = await productApi.deleteProductById(id);
    console.log(res);
    await getData();
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      sorter: (a, b) => a.description.length - b.description.length,
    },
    {
      title: "Loại",
      dataIndex: "typeName",
      key: "typeName",
      sorter: (a, b) => a.typeName.length - b.typeName.length,
    },
    {
      title: "Giá 1000 VND",
      dataIndex: "price",
      key: "price",
      render: (price) => {
          return <div>
            {price ? new Intl.NumberFormat().format(price*1000) : ""} VND
          </div>
      },
      sorter: (a, b) => a.price?.length - b.price?.length,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: [
        {
          text: "Đang bán",
          value: true,
        },
        {
          text: "Không bán",
          value: false,
        },
      ],
      onFilter: (value, record) => record.status === value,
      sorter: (a, b) => a.status?.length - b.status?.length,
      render: (status) => {
        let color;
        let valueVN;
        switch (status) {
          case false:
            color = "red";
            valueVN = "Không bán";
            break;
          case true:
            color = "green";
            valueVN = "Đang bán";
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
          <a
            onClick={() => {
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
    console.log("params", pagination, filters, sorter, extra);
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
          Thêm sản phẩm
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
            <Form.Item
              name={"productID"}
              label="Mã sản phẩm"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name={"description"} label="Mô tả">
              <TextArea rows="4" />
            </Form.Item>
            <Form.Item name={"price"} label="Giá 1000 VND">
              <Input type="number" min="0" />
            </Form.Item>
            <Form.Item name={"type"} label="Loại" rules={[{ required: true }]}>
              <Select
                placeholder="Chọn loại sản phẩm"
                defaultValue={data.type}
                allowClear
              >
                {dataOption.map((item, index) => {
                  return <Option value={item._id}>{item.name}</Option>;
                })}
              </Select>
            </Form.Item>
            <Form.Item name={"status"} label="Trạng thái bán">
              <Select
                placeholder="Chọn trạng thái"
                allowClear
              >
                <Option value={true}>Đang bán</Option>
                <Option value={false}>Không bán</Option>
              </Select>
            </Form.Item>
            <Form.Item name={"photo"} label="Ảnh sản phẩm">
              <Upload
                name="photo"
                listType="picture-card"
                className="avatar-uploader"
                fileList={fileList}
                showUploadList={false}
                action={LINK_UPLOAD_PHOTO}
                beforeUpload={beforeUpload}
                onChange={handleChangeAvatar}
              >
                {imageUrl ? (
                  <img
                    src={
                      LINK_DIRECTORY_FILES + (data.photo || imageUrl)
                    }
                    alt="avatar"
                    style={{ width: "100%" }}
                  />
                ) : (
                  uploadButton
                )}
              </Upload>
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
            expandedRowRender: (record) => (
              <p style={{ margin: 0 }}>
                <img
                  src={
                    LINK_DIRECTORY_FILES + (record.photo || imageUrl)
                  }
                  alt="avatar"
                  style={{ width: "200px" }}
                />
              </p>
            ),
            rowExpandable: (record) => record.name !== "Not Expandable",
          }}
        />
      </div>
    </>
  );
}

ProductManager.propTypes = {};

export default ProductManager;
