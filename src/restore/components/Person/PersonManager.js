import React, {useEffect, useState} from "react";
import {Button, Form, Input, Upload} from "antd";
import userApi from "../../../api/userApi";
import {useDispatch, useSelector} from "react-redux";
import {beforeUpload, getBase64} from "../../../functions/functions";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import {setDataUser} from "../../../redux/actions/auth";
import {LINK_DIRECTORY_FILES, LINK_UPLOAD_PHOTO} from "../../../constants/constants";

function PersonManager(props) {
  const dispatch = useDispatch()

  return (
    <div>
      PersonManager
    </div>
  );
}

PersonManager.propTypes = {};

export default PersonManager;
