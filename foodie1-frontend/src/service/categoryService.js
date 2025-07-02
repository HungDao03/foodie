import { axiosInstance } from "../configs/axios.config";

class CategoryService {
    // Lấy tất cả danh mục
    static async getAllCategories() {
        return await axiosInstance.get("/categories");
    }

    static async getCategoryById(id) {
        return await axiosInstance.get(`/categories/${id}`);
    }

    // Tạo danh mục mới (cho admin)
    static async createCategory(categoryData) {
        return await axiosInstance.post("/categories", categoryData);
    }

    // Cập nhật danh mục (cho admin)
    static async updateCategory(id, categoryData) {
        return await axiosInstance.put(`/categories/${id}`, categoryData);
    }

    // Xóa danh mục (cho admin)
    static async deleteCategory(id) {
        return await axiosInstance.delete(`/categories/${id}`);
    }

    // Lấy món ăn theo danh mục
    static async getFoodsByCategory(categoryId) {
        return await axiosInstance.get(`/food-items?categoryId=${categoryId}`);
    }
}

export default CategoryService; 