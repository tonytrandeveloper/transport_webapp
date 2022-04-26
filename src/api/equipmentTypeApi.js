import axiosClient from "./axiosClient";
import { notification } from "antd";

const equipmentTypeApi = {
  getAllEquipmentType: async () => {
    try {
      const response = await axiosClient.get(`api/v1/equipmentType/list`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  deleteEquipmentTypeById: async (id) => {
    try {
      const response = await axiosClient.delete(`api/v1/equipmentType/delete/${id}`);
      notification.success({ message: "Xóa loại sản phẩm thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
  editEquipmentTypeById: async (id, data) => {
    try {
      const response = await axiosClient.patch(`api/v1/equipmentType/edit/${id}`, data);
      notification.success({ message: "Sửa loại sản phẩm thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
  createEquipmentType: async (data) => {
    try {
      const response = await axiosClient.post(`api/v1/equipmentType/create`, data);
      notification.success({ message: "Thêm loại sản phẩm thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
  showEquipmentType: async (id) => {
    try {
      const response = await axiosClient.get(`api/v1/equipmentType/show/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default equipmentTypeApi;
