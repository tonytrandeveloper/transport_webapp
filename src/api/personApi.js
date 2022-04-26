import axiosClient from "./axiosClient";
import { notification } from "antd";

const personApi = {
  getAllPerson: async () => {
    try {
      const response = await axiosClient.get(`api/v1/person/list`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  deletePersonById: async (id) => {
    try {
      const response = await axiosClient.delete(`api/v1/person/delete/${id}`);
      notification.success({ message: "Xóa loại sản phẩm thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
  editPersonById: async (id, data) => {
    try {
      const response = await axiosClient.patch(`api/v1/person/edit/${id}`, data);
      notification.success({ message: "Sửa loại sản phẩm thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
  createPerson: async (data) => {
    try {
      const response = await axiosClient.post(`api/v1/person/create`, data);
      notification.success({ message: "Thêm loại sản phẩm thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
  showPerson: async (id) => {
    try {
      const response = await axiosClient.get(`api/v1/person/show/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default personApi;
