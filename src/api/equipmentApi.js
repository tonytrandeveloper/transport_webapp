import axiosClient from "./axiosClient";
import { notification } from "antd";

const equipmentApi = {
  getAllEquipment: async () => {
    try {
      const response = await axiosClient.get(`api/v1/equipment/list`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  deleteEquipmentById: async (id) => {
    try {
      const response = await axiosClient.delete(`api/v1/equipment/delete/${id}`);
      notification.success({ message: "Xóa loại sản phẩm thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
  editEquipmentById: async (id, data) => {
    try {
      const response = await axiosClient.patch(`api/v1/equipment/edit/${id}`, data);
      notification.success({ message: "Sửa loại sản phẩm thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
  createEquipment: async (data) => {
    try {
      const response = await axiosClient.post(`api/v1/equipment/create`, data);
      notification.success({ message: "Thêm loại sản phẩm thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
  showEquipment: async (id) => {
    try {
      const response = await axiosClient.get(`api/v1/equipment/show/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default equipmentApi;
