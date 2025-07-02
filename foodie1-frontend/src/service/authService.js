// Import axiosInstance đã được cấu hình sẵn từ file config
import { axiosInstance } from "../configs/axios.config";

// Định nghĩa lớp AuthService để xử lý xác thực người dùng
class AuthService {
    // Phương thức đăng nhập
    static async login(username, password) {
        // Gửi yêu cầu POST đến endpoint /login với username và password
        const response = await axiosInstance.post('/login', { username, password });

        // Nếu phản hồi chứa token thì lưu dữ liệu người dùng vào localStorage
        if (response.data.token) {
            this.saveUserData(response.data);
        }

        // Trả về toàn bộ phản hồi (response) để bên ngoài xử lý thêm nếu cần
        return response;
    }

    // Phương thức đăng ký
    static async register(userData) {
        // Gửi yêu cầu POST đến endpoint /register với thông tin người dùng
        const response = await axiosInstance.post('/register', userData);

        // Nếu phản hồi chứa token thì lưu dữ liệu người dùng vào localStorage
        if (response.data.token) {
            this.saveUserData(response.data);
        }

        // Trả về toàn bộ phản hồi
        return response;
    }

    // Phương thức đăng xuất
    static logout() {
        // Xóa token và thông tin người dùng khỏi localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    // Phương thức lưu dữ liệu người dùng vào localStorage
    static saveUserData(data) {
        // Lưu token riêng và toàn bộ đối tượng người dùng dưới dạng chuỗi JSON
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
    }

    // Lấy thông tin người dùng hiện tại từ localStorage
    static getCurrentUser() {
        const userStr = localStorage.getItem('user'); // Lấy chuỗi JSON người dùng
        return userStr ? JSON.parse(userStr) : null;   // Chuyển về object nếu tồn tại
    }

    // Kiểm tra xem người dùng hiện tại có phải admin hay không
    static isAdmin() {
        const user = this.getCurrentUser();        // Lấy user hiện tại
        return user?.role === 'ADMIN';             // Trả về true nếu role là 'ADMIN'
    }
}


export default AuthService;
