import React, {useEffect, useState} from "react";
import {Button, Col, Form, Input, Row, Select, Upload} from "antd";
import {beforeUpload, getBase64} from "../../functions/functions";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import PropTypes from "prop-types";
import {compose} from "redux";
import {withStyles} from "@mui/styles";
import productTypeApi from "../../api/productTypeApi";
import productApi from "../../api/productApi";
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

const { Option } = Select;

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
  price: '',
  vat: '',
  type: null,
  unit: '',
  logo: null,
}

const ProductForm = (props) => {
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
    const res = await productApi.showProduct(productId);
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
      <div style={{ marginTop: 8 }}>T???i ???nh l??n</div>
    </div>
  );


  const onFinish = async (values) => {
    console.log(values)

    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('code', values.code);
    formData.append('price', values.price);
    formData.append('vat', values.vat);
    formData.append('type', values.type);
    formData.append('unit', values.unit);
    formData.append('logo', values.logo ? values.logo?.file?.originFileObj : dataProduct?.logo?._id ?? null);
    if (formType === FORM_TYPE_EDIT && match.params.id) {
      await productApi.editProductById(match.params.id, formData);
    } else {
      await productApi.createProduct(formData);
    }
    history.push(links.PRODUCT_LIST)
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
              <Form.Item name={"logo"} label="???nh s???n ph???m" className={classes.formLeft}>
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
                        message: 'Xin h??y nh???p t??n s???n ph???m!',
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
                        message: 'Xin h??y nh???p m?? s???n ph???m!',
                      },
                    ]}
                    initialValue={initialForm.code}
                  >
                    <Input placeholder="M??"/>
                  </Form.Item>
                </Col>
                <Col item xs={8}>
                  <Form.Item
                    name="price"
                    label="Gi?? (VND)"
                    rules={[
                      {
                        required: true,
                        message: 'Xin h??y nh???p gi?? s???n ph???m!',
                      },
                    ]}
                    initialValue={initialForm.price}
                  >
                    <Input placeholder="Gi??" type="number"/>
                  </Form.Item>
                </Col>
                <Col item xs={8}>
                  <Form.Item
                    name="vat"
                    label="Thu??? (%)"
                    rules={[
                      {
                        required: true,
                        message: 'Xin h??y nh???p thu??? s???n ph???m!',
                      },
                    ]}
                    initialValue={initialForm.vat}
                  >
                    <Input placeholder="Thu???" type="number"/>
                  </Form.Item>
                </Col>
                <Col item xs={8}>
                  <Form.Item
                    name="unit"
                    label="????n v???"
                    rules={[
                      {
                        required: true,
                        message: 'Xin h??y nh???p ????n v??? s???n ph???m!',
                      },
                    ]}
                    initialValue={initialForm.unit}
                  >
                    <Input placeholder="????n v???"/>
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

ProductForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withStyles(styles), withRouter)(ProductForm);
