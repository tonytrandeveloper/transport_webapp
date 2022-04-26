import axiosClient from "./axiosClient";
import { notification } from "antd";

const projectApi = {
  getAllProject: async () => {
    try {
      const response = await axiosClient.get(`api/v1/project/list`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  deleteProjectById: async (id) => {
    try {
      const response = await axiosClient.delete(`api/v1/project/delete/${id}`);
      notification.success({ message: "Xóa loại sản phẩm thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
  editProjectById: async (id, data) => {
    try {
      const response = await axiosClient.patch(`api/v1/project/edit/${id}`, data);
      notification.success({ message: "Sửa loại sản phẩm thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
  createProject: async (data) => {
    try {
      const response = await axiosClient.post(`api/v1/project/create`, data);
      notification.success({ message: "Thêm loại sản phẩm thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
  showProject: async (id) => {
    try {
      const response = await axiosClient.get(`api/v1/project/show/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default projectApi;
