import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Tạo instance axios với cấu hình mặc định
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

// Thêm interceptor để tự động thêm token vào header
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            // Đảm bảo token có prefix "Bearer "
            config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        }
        console.log('Request config:', config); // Debug log
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Thêm interceptor để xử lý response
axiosInstance.interceptors.response.use(
    (response) => {
        console.log('Response:', response); // Debug log
        return response;
    },
    (error) => {
        console.error('API Error:', error.response || error); // Debug log
        return Promise.reject(error);
    }
);

const foodService = {
    getAllFoodItems: async () => {
        try {
            console.log('Fetching food items...'); // Debug log
            console.log('Current token:', localStorage.getItem('token')); // Debug log
            
            const response = await axiosInstance.get('/food-items');
            console.log('Food items response:', response.data); // Debug log
            return response.data;
        } catch (error) {
            console.error('Error fetching food items:', error);
            throw error;
        }
    },

    getFoodItemsByCategory: async (categoryId) => {
        try {
            const response = await axiosInstance.get(`/food-items?categoryId=${categoryId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching food items by category:', error);
            throw error;
        }
    },

    searchFoodItems: async (keyword) => {
        try {
            const response = await axiosInstance.get(`/food-items/search?keyword=${keyword}`);
            return response.data;
        } catch (error) {
            console.error('Error searching food items:', error);
            throw error;
        }
    }
};

export default foodService; 