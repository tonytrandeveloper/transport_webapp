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
import userApi from "../../api/userApi";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import Highlighter from "react-highlight-words";
import {
  SearchOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  LINK_DIRECTORY_FILES,
  LINK_UPLOAD_PHOTO,
  ROLE_ADMIN,
  ROLE_CASHIER, ROLE_CUSTOMER, ROLE_INVENTORY_MANAGER,
  validateMessages
} from "../../constants/constants";
import {beforeUpload, getBase64} from "../../functions/functions";
import {useSelector} from "react-redux";

const { Option } = Select;
const ACTION_ADD = "Thêm thành viên";
const ACTION_EDIT = "Sửa thông tin thành viên";

function ClientList(props) {
  const [pagination, setPagination] = useState({ pageSize: 5, current: 1 });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [action, setAction] = useState("Sửa thông tin");
  const [editId, setEditId] = useState("");
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [fileList, setFileList] = useState([]);
  const dataUser = useSelector(
    (state) => state.authReducer.dataUser
  );
  const [form] = Form.useForm();

  const handleChangeAvatar = (info) => {
    setFileList(info.fileList);
    if (info.file.status === "uploading") {
      setLoadingPhoto(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
        setImageUrl(info.file.response.photo);
        setLoadingPhoto(false);
      });
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
    if (action === ACTION_EDIT) {
      await userApi.editUserById(editId, { ...values, photo: imageUrl });
    } else {
      await userApi.createUser({
        ...values,
        photo: imageUrl,
      });
    }
    await getData();
    setIsModalVisible(false);
    setImageUrl(null);
  };

  const showModal = (type) => {
    setAction(type);
    setIsModalVisible(true);
  };

  const handleOkModal = () => {
    setIsModalVisible(false);
    setImageUrl(null);
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
    setImageUrl(null);
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
  }, []);

  const getData = async () => {
    let res = await userApi.getAllUser();
    if (res.status === 200) {
      let resData = res.data.map((item, index) => {
        return {...item, key: index};
      });
      if (res.data.photo) setImageUrl(res.data.photo);
      setData(resData);
    }
  };

  const handleDelete = async (id) => {
    const res = await userApi.deleteUserById(id);
    await getData();
  };
  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.length - b.email.length,
      key: "email",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      sorter: (a, b) => a.address?.length - b.address?.length,
      key: "address",
    },
    {
      title: "Quyền",
      dataIndex: "role",
      key: "role",
      filters: [
        {
          text: "Admin",
          value: ROLE_ADMIN,
        },
        {
          text: "Nhân viên thu ngân",
          value: ROLE_CASHIER,
        },
        {
          text: "Khách hàng",
          value: ROLE_CUSTOMER,
        },
        {
          text: "Nhân viên kho",
          value: ROLE_INVENTORY_MANAGER,
        },
      ],
      onFilter: (value, record) => record.role.indexOf(value) === 0,
      sorter: (a, b) => a.role?.length - b.role?.length,
      render: (role) => {
        let color;
        let valueVN;
        switch (role) {
          case ROLE_ADMIN:
            color = "red";
            valueVN = "Admin";
            break;
          case ROLE_CASHIER:
            color = "green";
            valueVN = "Nhân viên thu ngân";
            break;
          case ROLE_CUSTOMER:
            color = "gray";
            valueVN = "Khách hàng";
            break;
          case ROLE_INVENTORY_MANAGER:
            color = "blue";
            valueVN = "Nhân viên kho";
            break;
          default:
            valueVN = "Khách hàng";
        }
        return (
          <Tag color={color} key={role}>
            {valueVN}
          </Tag>
        );
      },
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      sorter: (a, b) => a.phone?.length - b.phone?.length,
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

          {dataUser && dataUser.dataUser && dataUser.dataUser._id !== record._id && <Popconfirm
            title="Bạn có muốn xóa?"
            onConfirm={() => handleDelete(record._id)}
          >
            <a>
              <RiDeleteBin6Line color={"red"} size={"18px"} />
            </a>
          </Popconfirm>}
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
          Thêm thành viên
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
            className={"member-manager-form"}
          >
            <Form.Item name={"name"} label="Tên" rules={[
              { required: true }
            ]}>
              <Input />
            </Form.Item>
            <Form.Item name={"email"} label="Email" rules={[
              { type: "email" },
              { required: true }
            ]}>
              <Input />
            </Form.Item>
            <Form.Item name={"address"} label="Địa chỉ" rules={[
              { required: true }
            ]}>
              <Input />
            </Form.Item>
            <Form.Item name={"role"} label="Quyền" rules={[
              { required: true }
            ]}>
              <Select
                placeholder="Chọn quyền"
                allowClear
              >
                <Option value={ROLE_ADMIN}>Admin</Option>
                <Option value={ROLE_CASHIER}>Nhân viên thu ngân</Option>
                <Option value={ROLE_INVENTORY_MANAGER}>Nhân viên kho</Option>
                <Option value={ROLE_CUSTOMER}>Khách hàng</Option>
              </Select>
            </Form.Item>
            <Form.Item name={"phone"} label="Số điện thoại" rules={[
              { required: true }
            ]}>
              <Input />
            </Form.Item>
            { action === ACTION_ADD && <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Xin hãy nhập mật khẩu!'
                }
              ]}
              label="Mật khẩu"
            >
              <Input.Password placeholder="Mật khẩu"/>
            </Form.Item>}
            <Form.Item name={"photo"} label="Ảnh đại diện">
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
                {(data.photo || imageUrl) ? (
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
                {record.photo && <img
                  src={
                    LINK_DIRECTORY_FILES + (record.photo)
                  }
                  alt="avatar"
                  style={{ width: "200px" }}
                />}
              </p>
            ),
            rowExpandable: (record) => record.name !== "Not Expandable",
          }}
        />
      </div>
    </>
  );
}

ClientList.propTypes = {};

export default ClientList;
