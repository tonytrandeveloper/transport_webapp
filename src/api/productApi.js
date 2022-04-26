import axiosClient from "./axiosClient";
import { notification } from "antd";

const productApi = {
  getAllProduct: async () => {
    try {
      const response = await axiosClient.get(`api/v1/product/list`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  deleteProductById: async (id) => {
    try {
      const response = await axiosClient.delete(`api/v1/product/delete/${id}`);
      notification.success({ message: "Xóa loại sản phẩm thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
  editProductById: async (id, data) => {
    try {
      const response = await axiosClient.patch(`api/v1/product/edit/${id}`, data);
      notification.success({ message: "Sửa loại sản phẩm thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
  createProduct: async (data) => {
    try {
      const response = await axiosClient.post(`api/v1/product/create`, data);
      notification.success({ message: "Thêm loại sản phẩm thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
  showProduct: async (id) => {
    try {
      const response = await axiosClient.get(`api/v1/product/show/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default productApi;
