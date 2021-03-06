import React, {useEffect, useState} from "react";
import {Button, Col, DatePicker, Form, Input, Row, Select, Upload} from "antd";
import {beforeUpload, getBase64} from "../../functions/functions";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import PropTypes from "prop-types";
import {compose} from "redux";
import {withStyles} from "@mui/styles";
import projectTypeApi from "../../api/projectTypeApi";
import projectApi from "../../api/projectApi";
import {
  FORM_TYPE_EDIT,
  FORM_TYPE_NEW,
  ROLE_ADMIN,
  ROLE_CASHIER,
  ROLE_CUSTOMER,
  ROLE_INVENTORY_MANAGER
} from "../../constants/constants";
import {withRouter} from "react-router-dom";
import * as links from "../../constants/links"
import moment from "moment";

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
  name: '',
  code: '',
  description: '',
  startDate: '',
  endDate: '',
  days: '',
  amount: '',
  type: null,
  logo: null,
}

const ProjectForm = (props) => {
  const {
    classes,
    history,
    formType,
    match
  } = props;
  console.log(formType)
  console.log(match.params.id)
  const [imageUrl, setImageUrl] = useState(false);
  const [productTypes, setProductTypes] = useState([]);
  const [initialForm, setInitialForm] = useState(null);
  const [dataProduct, setDataProduct] = useState(null)
  useEffect(() => {
    if (formType === FORM_TYPE_EDIT && match.params.id) {
      getDataProduct(match.params.id);
    } else {
      setInitialForm({...dataInitial})
    }
  }, [])
  const getDataProduct = async (productId) => {
    const res = await projectApi.showProject(productId);
    if (res.status === 200 && res.data.item) {
      const data = res.data.item;
      const fileId = data?.logo?.fileId;
      if (fileId) {
        setImageUrl(`https://drive.google.com/uc?export=view&id=${fileId}`)
      }
      setInitialForm({
        ...data,
      })
      setDataProduct(data);
    }
  }

  useEffect(() => {
    getProductTypes();
  }, [])

  const getProductTypes = async () => {
    let res = await projectTypeApi.getAllProjectType();
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
      <div style={{ marginTop: 8 }}>T???i ???nh l??n</div>
    </div>
  );


  const onFinish = async (values) => {
    console.log(values)

    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('code', values.code);
    formData.append('description', values.description);
    formData.append('startDate', values.startDate ? moment(values.startDate).format('YYYY-MM-DD') :'');
    formData.append('endDate', values.endDate ? moment(values.endDate).format('YYYY-MM-DD') :'');
    formData.append('days', values.days);
    formData.append('amount', values.amount);
    formData.append('type', values.type);
    formData.append('logo', values.logo ? values.logo?.file?.originFileObj : dataProduct?.logo?._id ?? null);
    if (formType === FORM_TYPE_EDIT && match.params.id) {
      await projectApi.editProjectById(match.params.id, formData);
    } else {
      await projectApi.createProject(formData);
    }
    history.push(links.PROJECT_LIST)
  }
  console.log(initialForm)
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
              <Form.Item name={"logo"} label="???nh d?? ??n" className={classes.formLeft}>
                <Upload
                  name="logo"
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
                <Col item xs={12}>
                  <Form.Item
                    name="name"
                    label="T??n"
                    rules={[
                      {
                        required: true,
                        message: 'Xin h??y nh???p t??n d??? ??n!',
                      },
                    ]}
                    initialValue={initialForm.name}
                  >
                    <Input placeholder="T??n"/>
                  </Form.Item>
                </Col>
                <Col item xs={12}>
                  <Form.Item
                    name="code"
                    label="M??"
                    rules={[
                      {
                        required: true,
                        message: 'Xin h??y nh???p m?? d??? ??n!',
                      },
                    ]}
                    initialValue={initialForm.code}
                  >
                    <Input placeholder="M??"/>
                  </Form.Item>
                </Col>
                <Col item xs={24}>
                  <Form.Item
                    name="description"
                    label="M?? t???"
                    rules={[
                      {
                        required: true,
                        message: 'Xin h??y nh???p m?? t??? thi???t b???!',
                      },
                    ]}
                    initialValue={initialForm.description}
                  >
                    <TextArea rows={4}  placeholder="M?? t???"/>
                  </Form.Item>
                </Col>
                <Col item xs={12}>
                  <Form.Item
                    name="days"
                    label="S??? ng??y"
                    rules={[
                      {
                        required: true,
                        message: 'Xin h??y nh???p s??? ng??y d??? ??n!',
                      },
                    ]}
                    initialValue={initialForm.days}
                  >
                    <Input placeholder="S??? ng??y" type="number"/>
                  </Form.Item>
                </Col>
                <Col item xs={12}>
                  <Form.Item
                    name="amount"
                    label="Amount"
                    rules={[
                      {
                        required: true,
                        message: 'Xin h??y nh???p amount d??? ??n!',
                      },
                    ]}
                    initialValue={initialForm.amount}
                  >
                    <Input placeholder="Amount" type="number"/>
                  </Form.Item>
                </Col>
                <Col item xs={12}>
                  <Form.Item
                    name="startDate"
                    label="Ng??y b???t ?????u"
                    rules={[
                      {
                        required: true,
                        message: 'Xin h??y nh???p ng??y b???t ?????u d??? ans!',
                      },
                    ]}
                    initialValue={initialForm.startDate}
                  >
                    <DatePicker  />
                  </Form.Item>
                </Col>
                <Col item xs={12}>
                  <Form.Item
                    name="endDate"
                    label="Ng??y k???t th??c"
                    rules={[
                      {
                        required: true,
                        message: 'Xin h??y nh???p ng??y k???t th??c d??? ??n!',
                      },
                    ]}
                    initialValue={initialForm.endDate}
                  >
                    <DatePicker  />
                  </Form.Item>
                </Col>
                <Col item xs={24}>
                  <Form.Item
                    name={"type"}
                    label="Lo???i s???n ph???m"
                    rules={[
                      {required: true}
                    ]}
                    initialValue={initialForm.type}
                  >
                    <Select
                      placeholder="Ch???n lo???i s???n ph???m"
                      allowClear
                      defaultValue={initialForm.type}
                    >
                      {
                        productTypes.map(item => {
                          return (
                            <Option value={item._id}>{item.name}</Option>
                          )
                        })
                      }
                    </Select>
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
                  L??u
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

ProjectForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withStyles(styles), withRouter)(ProjectForm);
