import axiosClient from "./axiosClient";
import { notification } from "antd";

const projectTypeApi = {
  getAllProjectType: async () => {
    try {
      const response = await axiosClient.get(`api/v1/projectType/list`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  deleteProjectTypeById: async (id) => {
    try {
      const response = await axiosClient.delete(`api/v1/projectType/delete/${id}`);
      notification.success({ message: "Xóa loại sản phẩm thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
  editProjectTypeById: async (id, data) => {
    try {
      const response = await axiosClient.patch(`api/v1/projectType/edit/${id}`, data);
      notification.success({ message: "Sửa loại sản phẩm thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
  createProjectType: async (data) => {
    try {
      const response = await axiosClient.post(`api/v1/projectType/create`, data);
      notification.success({ message: "Thêm loại sản phẩm thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
  showProjectType: async (id) => {
    try {
      const response = await axiosClient.get(`api/v1/projectType/show/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default projectTypeApi;
