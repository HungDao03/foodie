import axios from "axios";

// Cấu hình cơ bản cho axios
export const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        'Content-Type': 'application/json'
    }
});

// Thêm token vào header
axiosInstance.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.token) {
            config.headers.Authorization = `${user.tokenType} ${user.token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Xử lý response
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Xử lý token hết hạn
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
); 