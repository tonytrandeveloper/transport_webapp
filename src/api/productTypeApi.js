import axiosClient from "./axiosClient";
import { notification } from "antd";

const productTypeApi = {
  getAllProductType: async () => {
    try {
      const response = await axiosClient.get(`api/v1/productType/list`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  deleteProductTypeById: async (id) => {
    try {
      const response = await axiosClient.delete(`api/v1/productType/delete/${id}`);
      notification.success({ message: "Xóa loại sản phẩm thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
  editProductTypeById: async (id, data) => {
    try {
      const response = await axiosClient.patch(`api/v1/productType/edit/${id}`, data);
      notification.success({ message: "Sửa loại sản phẩm thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
  createProductType: async (data) => {
    try {
      const response = await axiosClient.post(`api/v1/productType/create`, data);
      notification.success({ message: "Thêm loại sản phẩm thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
  showProductType: async (id) => {
    try {
      const response = await axiosClient.get(`api/v1/productType/show/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default productTypeApi;
