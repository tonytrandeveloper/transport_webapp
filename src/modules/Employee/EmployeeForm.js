import React, {useEffect, useState} from "react";
import {Button, Checkbox, Col, DatePicker, Form, Input, Row, Select, Upload} from "antd";
import {beforeUpload, getBase64} from "../../functions/functions";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import PropTypes from "prop-types";
import {compose} from "redux";
import {withStyles} from "@mui/styles";
import productTypeApi from "../../api/productTypeApi";
import personApi from "../../api/personApi";
import {
  FORM_TYPE_EDIT,
  FORM_TYPE_NEW, GENDER_FEMALE, GENDER_MALE, GENDER_SECRET,
  ROLE_ADMIN,
  ROLE_CASHIER,
  ROLE_CUSTOMER, ROLE_EMPLOYEE,
  ROLE_INVENTORY_MANAGER, ROLE_SUPERADMIN
} from "../../constants/constants";
import {withRouter} from "react-router-dom";
import * as links from "../../constants/links"
import moment from "moment";
import {useSelector} from "react-redux";

const { Option } = Select;
const { TextArea } = Input;
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
  formLeft: {
    display: 'flex',
    flexDirection: 'column',
    '& .ant-form-item-label': {
      textAlign: 'left'
    },
  },
  logo: {
    width: 180,
    height: 180,
    '& .ant-upload': {
      width: '100%',
      height: '100%'
    }
  },
  formRight: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    '& .ant-form-item': {
      display: 'flex',
      flexDirection: 'column',
      padding: '0 2px',
      margin: '5px 0',
      '& .ant-form-item-label': {
        textAlign: 'left'
      },
      '& .ant-picker': {
        width: '100%'
      }
    }
  },
  formFooter: {
    textAlign: 'center',
    padding: '20px 0'
  }
}

const dataInitial = {
  isUser: true,
  email: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  birthday: '',
  gender: '',
  address_description: '',
  address_city: '',
  address_country: '',
  address_postalCode: '',
  username: '',
  password: '',
  role: '',
  avatar: null,
}

const EmployeeForm = (props) => {
  const {
    classes,
    history,
    formType,
    match
  } = props;
  const {
    dataUser
  } = useSelector(state => state.authReducer);
  const [imageUrl, setImageUrl] = useState(false);
  const [productTypes, setProductTypes] = useState([]);
  const [initialForm, setInitialForm] = useState(null);
  const [dataProduct, setDataProduct] = useState(null);
  const [isUser, setIsUser] = useState(true);
  console.log(formType)
  useEffect(() => {
    if (formType === FORM_TYPE_EDIT && match.params.id) {
      getDataProduct(match.params.id);
    } if (formType === "account") {
      const personId = dataUser?.data?.person?._id;
      if (personId) {
        // setInitialForm(null);
        getDataProduct(personId);
      }
    } else {
      setInitialForm({...dataInitial})
    }
  }, [])
  const getDataProduct = async (productId) => {
    const res = await personApi.showPerson(productId);
    if (res.status === 200 && res.data.item) {
      const data = res.data.item;
      const fileId = data?.avatar?.fileId;
      if (fileId) {
        setImageUrl(`https://drive.google.com/uc?export=view&id=${fileId}`)
      }
      console.log({
        ...data,
        birthday: data.birthday ? moment(data.birthday) : '',
        username: data.user?.username ?? "",
        role: data.user?.role ?? "",
        address_description: data.address?.description ?? "",
        address_city: data.address?.city ?? "",
        address_country: data.address?.country ?? "",
        address_postalCode: data.address?.postalCode ?? "",
      })
      setInitialForm({
        ...data,
        birthday: data.birthday ? moment(data.birthday) : '',
        username: data.user?.username ?? "",
        role: data.user?.role ?? "",
        address_description: data.address?.description ?? "",
        address_city: data.address?.city ?? "",
        address_country: data.address?.country ?? "",
        address_postalCode: data.address?.postalCode ?? "",
      })
      setDataProduct(data);
      if (!data.user) {
        setIsUser(false);
      }
    }
  }

  useEffect(() => {
    getProductTypes();
  }, [])

  const getProductTypes = async () => {
    let res = await productTypeApi.getAllProductType();
    if (res.status === 200 && Array.isArray(res.data.items)) {
      let resData = res.data.items.map((item, index) => {
        return {...item, key: index};
      });
      setProductTypes(resData)
    }
  }
  const handleChange = info => {
    console.log(info.file.originFileObj)
    getBase64(info.file.originFileObj, imageUrl => {
      setImageUrl(imageUrl)
    });
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
    </div>
  );


  const onFinish = async (values) => {
    console.log(values)

    const formData = new FormData();
    formData.append('email', values.email);
    formData.append('firstName', values.firstName);
    formData.append('lastName', values.lastName);
    formData.append('phoneNumber', values.phoneNumber);
    formData.append('birthday', values.birthday ? moment(values.birthday).format('YYYY-MM-DD') :'');
    formData.append('gender', values.gender);
    formData.append('address_description', values.address_description);
    formData.append('address_city', values.address_city);
    formData.append('address_country', values.address_country);
    formData.append('address_postalCode', values.address_postalCode);
    formData.append('avatar', values.avatar ? values.avatar?.file?.originFileObj : dataProduct?.avatar?._id ?? null);
    if (isUser) {
      formData.append('username', values.username);
      formData.append('password', values.password);
      formData.append('role', values.role);
    }
    if (formType === FORM_TYPE_EDIT && match.params.id) {
      await personApi.editPersonById(match.params.id, formData);
    } if (formType === "account") {
      const personId = dataUser?.data?.person?._id;
      if (personId) {
        await personApi.editPersonById(personId, formData);
      }
    } else {
      await personApi.createPerson(formData);
    }
    if (formType === "account") {
      const personId = dataUser?.data?.person?._id;
      if (personId) {
        setInitialForm(null);
        getDataProduct(personId)
      }
    } else {
      history.push(links.EMPLOYEE_LIST)
    }
  }

  const onChangeIsUser = (event) => [
    // console.log(event.target.name, event.target.checked)
    setIsUser(event.target.checked)
  ]

  const role = dataUser?.data?.role ?? "";
  if (initialForm) {
    return (
      <div className={classes.container}>
        <Form
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
          style={{
            width: '100%',
            maxWidth: 800,
          }}
        >
          <Row>
            <Col item xs={24} sm={12} md={12} lg={8}>
              <Form.Item name={"avatar"} label="Ảnh nhân viên" className={classes.formLeft}>
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className={classes.logo}
                  fileList={[]}
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                >
                  {imageUrl ? <div style={{
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden'
                  }}>
                    <img src={imageUrl} alt="avatar" style={{width: '100%'}}/>
                  </div> : uploadButton}

                </Upload>
              </Form.Item>
            </Col>
            <Col item xs={24} sm={12} md={12} lg={16} className={classes.formRight}>
              <Row>
                {formType === FORM_TYPE_NEW && <Col item xs={24}>
                  <Form.Item
                    name="isUser"
                   valuePropName="checked"
                   wrapperCol={{ offset: 8, span: 16 }}
                    initialValue={initialForm.isUser}
                  >
                    <Checkbox name="isUser" onChange={onChangeIsUser}>Với tài khoản</Checkbox>
                  </Form.Item>
                </Col>}
                {
                  isUser ?
                    <>
                      <Col item xs={formType === FORM_TYPE_NEW ? 12 : 24}>
                        <Form.Item
                          name="username"
                          label="Tên tài khoản"
                          rules={[
                            {
                              required: true,
                              message: 'Xin hãy nhập tên tài khoản của bạn!',
                            },
                          ]}
                          initialValue={initialForm.username}
                        >
                          <Input placeholder="Tên tài khoản"/>
                        </Form.Item>
                      </Col>
                      {formType === FORM_TYPE_NEW && <Col item xs={12}>
                        <Form.Item
                          name="password"
                          label="Mật khẩu"
                          rules={[
                            {
                              required: true,
                              message: 'Xin hãy nhập mật khẩu nhân viên!',
                            },
                          ]}
                          initialValue={initialForm.password}
                        >
                          <Input.Password placeholder="Mật khẩu"/>
                        </Form.Item>
                      </Col>}
                      <Col item xs={24}>
                        <Form.Item
                          name="role"
                          label="Vai trò"
                          rules={[
                            {
                              required: true,
                              message: 'Xin hãy chọn vai trò nhân viên!',
                            },
                          ]}
                          initialValue={initialForm.role}
                        >
                          <Select
                            placeholder="Chọn vai trò"
                            allowClear
                            defaultValue={initialForm.role}
                          >
                            <Option value={ROLE_EMPLOYEE}>Nhân viên</Option>
                            {role === ROLE_SUPERADMIN && <Option value={ROLE_ADMIN}>Quản trị viên</Option>}
                          </Select>
                        </Form.Item>
                      </Col>
                    </>
                    :
                    <>
                    </>
                }
                <Col item xs={12}>
                  <Form.Item
                    name="firstName"
                    label="Tên"
                    rules={[
                      {
                        required: true,
                        message: 'Xin hãy nhập tên nhân viên!',
                      },
                    ]}
                    initialValue={initialForm.firstName}
                  >
                    <Input placeholder="Tên"/>
                  </Form.Item>
                </Col>
                <Col item xs={12}>
                  <Form.Item
                    name="lastName"
                    label="Họ"
                    rules={[
                      {
                        required: true,
                        message: 'Xin hãy nhập họ nhân viên!',
                      },
                    ]}
                    initialValue={initialForm.lastName}
                  >
                    <Input placeholder="Họ"/>
                  </Form.Item>
                </Col>
                <Col item xs={12}>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      {
                        type: "email",
                        message: 'Xin hãy nhập email đúng định dạng!',
                      },
                      {
                        required: true,
                        message: 'Xin hãy nhập email nhân viên!',
                      },
                    ]}
                    initialValue={initialForm.email}
                  >
                    <Input placeholder="Email"/>
                  </Form.Item>
                </Col>
                <Col item xs={12}>
                  <Form.Item
                    name="phoneNumber"
                    label="Số điện thoại"
                    rules={[
                      {
                        required: true,
                        message: 'Xin hãy nhập số điện thoại nhân viên!',
                      },
                    ]}
                    initialValue={initialForm.phoneNumber}
                  >
                    <Input type="number" placeholder="Số điện thoại"/>
                  </Form.Item>
                </Col>
                <Col item xs={12}>
                  <Form.Item
                    name="birthday"
                    label="Ngày sinh"
                    rules={[
                      {
                        required: true,
                        message: 'Xin hãy nhập ngày sinh nhân viên!',
                      },
                    ]}
                    initialValue={initialForm.birthday}
                  >
                    <DatePicker  />
                  </Form.Item>
                </Col>
                <Col item xs={12}>
                  <Form.Item
                    name="gender"
                    label="Giới tinh"
                    rules={[
                      {
                        required: true,
                        message: 'Xin hãy nhập giới tinh nhân viên!',
                      },
                    ]}
                    initialValue={initialForm.gender}
                  >
                    <Select
                      placeholder="Chọn giới tinh"
                      allowClear
                      defaultValue={initialForm.gender}
                    >
                      <Option value={GENDER_MALE}>Nam</Option>
                      <Option value={GENDER_FEMALE}>Nữ</Option>
                      <Option value={GENDER_SECRET}>Bí mật</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col item xs={8}>
                  <Form.Item
                    name="address_city"
                    label="Thành phố"
                    rules={[
                      {
                        required: true,
                        message: 'Xin hãy nhập thành phố nhân viên!',
                      },
                    ]}
                    initialValue={initialForm.address_city}
                  >
                    <Input placeholder="Thành phố"/>
                  </Form.Item>
                </Col>
                <Col item xs={8}>
                  <Form.Item
                    name="address_postalCode"
                    label="Postal code"
                    rules={[
                      {
                        required: true,
                        message: 'Xin hãy nhập mã bưu chính nhân viên!',
                      },
                    ]}
                    initialValue={initialForm.address_postalCode}
                  >
                    <Input type="number" placeholder="Thành phố"/>
                  </Form.Item>
                </Col>
                <Col item xs={8}>
                  <Form.Item
                    name="address_country"
                    label="Quốc gia"
                    rules={[
                      {
                        required: true,
                        message: 'Xin hãy nhập quốc gia nhân viên!',
                      },
                    ]}
                    initialValue={initialForm.address_country}
                  >
                    <Input placeholder="Quốc gia"/>
                  </Form.Item>
                </Col>
                <Col item xs={24}>
                  <Form.Item
                    name="address_description"
                    label="Địa chỉ chi tiết"
                    rules={[
                      {
                        required: true,
                        message: 'Xin hãy nhập địa chỉ chi tiết nhân viên!',
                      },
                    ]}
                    initialValue={initialForm.address_description}
                  >
                    <TextArea rows={4}  placeholder="Địa chỉ chi tiết"/>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col item xs={24} className={classes.formFooter}>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  Lưu
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    )
  } else {
    return (
      <div>
        loading...
      </div>
    )
  }
}

EmployeeForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withStyles(styles), withRouter)(EmployeeForm);
