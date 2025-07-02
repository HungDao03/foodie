import { useState, createContext, useContext } from 'react';

// Context quản lý danh sách món ăn và trạng thái loading
const FoodContext = createContext();

// Custom hook để sử dụng context
export function useFoodStore() {
    const context = useContext(FoodContext);
    if (!context) {
        throw new Error('useFoodStore chỉ được sử dụng bên trong FoodProvider');
    }
    return context;
}

// Provider bọc quanh các component cần dùng dữ liệu món ăn
export function FoodProvider({ children }) {
    const [foods, setFoods] = useState([]); // Danh sách món ăn
    const [loading, setLoading] = useState(false); // Trạng thái loading

    const value = {
        foods,
        setFoods,
        loading,
        setLoading
    };

    return (
        <FoodContext.Provider value={value}>
            {children}
        </FoodContext.Provider>
    );
}

export default FoodProvider;
