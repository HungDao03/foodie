import { axiosInstance } from "../configs/axios.config";

class AdminService {
    // Quản lý trạng thái người dùng
    static async updateUserStatus(userId, status) {
        return await axiosInstance.patch(`/users/${userId}/status`, { status });
    }

    // Quản lý đơn hàng
    static async getAllOrders() {
        return await axiosInstance.get("/orders");
    }

    static async updateOrderStatus(orderId, status) {
        return await axiosInstance.patch(`/orders/${orderId}/status`, { status });
    }

    // Thống kê (có thể thêm sau)
    static async getDashboardStats() {
        return await axiosInstance.get("/admin/dashboard");
    }

    // Quản lý danh mục
    static async createCategory(categoryData) {
        return await axiosInstance.post("/categories", categoryData);
    }

    static async updateCategory(id, categoryData) {
        return await axiosInstance.put(`/categories/${id}`, categoryData);
    }

    static async deleteCategory(id) {
        return await axiosInstance.delete(`/categories/${id}`);
    }
}

export default AdminService;
