import {axiosInstance} from "../configs/axios.config.js";

class FoodItemsService {
    // Quản lý món ăn
    static async getAllFoods() {
        return await axiosInstance.get("/food-items");
    }
    static async addFood(foodData) {
        // Nếu foodData đã là FormData, sử dụng trực tiếp
        if (foodData instanceof FormData) {
            return await axiosInstance.post("/food-items", foodData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        }

        // Nếu foodData là object thường, chuyển thành FormData
        const formData = new FormData();
        Object.keys(foodData).forEach(key => {
            // Chỉ append nếu giá trị không phải null hoặc undefined
            if (foodData[key] != null) {
                formData.append(key, foodData[key]);
            }
        });

        return await axiosInstance.post("/food-items", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    static async updateFood(id, foodData) {
        const formData = foodData instanceof FormData
            ? foodData
            : Object.entries(foodData).reduce((fd, [key, value]) => {
                if (value != null) fd.append(key, value);
                return fd;
            }, new FormData());

        return await axiosInstance.put(`/food-items/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }

    static async deleteFood(id) {
        return await axiosInstance.delete(`/food-items/${id}`);
    }

    // lấy tất cả món ăn theo id cua danh muc
    static async getFoodsByCategory(categoryId) {
        return await axiosInstance.get(`/food-items?categoryId=${categoryId}`);
    }

    static async searchFoods(keyword) {
        return await axiosInstance.get(`/food-items/search?keyword=${keyword}`);
    }


}

export default FoodItemsService;