import { axiosInstance } from "../configs/axios.config";

class OrderService {
    // Lấy tất cả đơn hàng (cho admin)
    static async getAllOrders() {
        return await axiosInstance.get("/orders");
    }

    // Lấy đơn hàng của user hiện tại
    static async getUserOrders() {
        const user = JSON.parse(localStorage.getItem('user'));
        return await axiosInstance.get(`/orders/${user.id}`);
    }

    // Tạo đơn hàng mới
    static async createOrder(orderData) {
        return await axiosInstance.post("/orders", orderData);
    }

    // Cập nhật trạng thái đơn hàng (cho admin)
    static async updateOrderStatus(orderId, status) {
        return await axiosInstance.patch(`/orders/${orderId}/status`, { status });
    }

    // Lấy chi tiết đơn hàng
    static async getOrderById(orderId) {
        return await axiosInstance.get(`/orders/${orderId}`);
    }

    // Xóa đơn hàng (cho admin)
    static async deleteOrder(orderId) {
        return await axiosInstance.delete(`/orders/${orderId}`);
    }
}

export default OrderService; 