import React, {useEffect, useState} from "react";
import {Button, Form, Input, Upload} from "antd";
import userApi from "../../api/userApi";
import {useDispatch, useSelector} from "react-redux";
import {beforeUpload, getBase64} from "../../functions/functions";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import {setDataUser} from "../../redux/actions/auth";
import {LINK_DIRECTORY_FILES, LINK_UPLOAD_PHOTO} from "../../constants/constants";

function AccountManager(props) {
  const dispatch = useDispatch()

  const [dataAccount, setDataAccount] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const dataUser = useSelector(
    (state) => state.authReducer.dataUser
  );
  // useEffect(async () => {
  //  setDataAccount(dataUser.dataUser);
  //   setImageUrl(dataUser.dataUser.photo);
  // }, []);

  const onFinish = async (values) => {
    let idUser = dataUser.dataUser && dataUser.dataUser._id ? dataUser.dataUser._id : null;
    const res = await userApi.editUserById(idUser, {
      ...values,
      photo: imageUrl,
    });
    if (res.status === 200) {
      dispatch(setDataUser({
        ...dataUser,
        dataUser: res.data
      }))
      await getUser();
    }
  }

  const getUser = async () => {
    let idUser = dataUser.dataUser && dataUser.dataUser._id ? dataUser.dataUser._id : null;
    if (idUser) {
      const res = await userApi.showUser(idUser);
      if (res.status === 200) {
        setDataAccount(res.data);
      }
    }
  }

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
    }
  };

  let email = dataAccount && dataAccount.email ? dataAccount.email : "";
  let address = dataAccount && dataAccount.address ? dataAccount.address : "";
  let name = dataAccount && dataAccount.name ? dataAccount.name : "";
  let phone = dataAccount && dataAccount.phone ? dataAccount.phone : "";
  return (
    <div className="wrapper bg-white mt-sm-5">
      <h4 className="pb-4 border-bottom">Qu???n l?? t??i kho???n</h4>
      {dataAccount && <Form
        name="normal_login"
        className="login-form"
        onFinish={onFinish}
      >
        <Form.Item name={"photo"} label="???nh ?????i di???n">
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
                  LINK_DIRECTORY_FILES + imageUrl
                }
                alt="avatar"
                style={{ width: "100%" }}
              />
            ) : (
              <div>
                {loadingPhoto ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>
        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: 'Xin h??y nh???p t??n c???a b???n!',
            },
          ]}
          initialValue={name}
        >
          <Input placeholder="T??n"/>
        </Form.Item>
        <Form.Item
          name="address"
          rules={[
            {
              required: true,
              message: 'Xin h??y nh???p ?????a ch??? c???a b???n!',
            },
          ]}
          initialValue={address}
        >
          <Input placeholder="?????a ch???"/>
        </Form.Item>
        <Form.Item
          name="phone"
          rules={[
            {
              required: true,
              message: 'Xin h??y nh???p s??? ??i???n tho???i c???a b???n!',
            },
          ]}
          initialValue={phone}
        >
          <Input placeholder="S??? ??i???n tho???i"/>
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            {
              type: 'email',
              message: 'B???n nh???p kh??ng ????ng ?????nh d???ng email!',
            },
            {
              required: true,
              message: 'Xin h??y nh???p email c???a b???n!',
            },
          ]}
          initialValue={email}
        >
          <Input placeholder="?????a ch??? email" disabled={true}/>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            style={{
              backgroundColor: '#53382c',
              borderColor: '#53382c'
            }}
          >
            C???p nh???t th??ng tin
          </Button>
        </Form.Item>
      </Form>}
    </div>
  );
}

AccountManager.propTypes = {};

export default AccountManager;
