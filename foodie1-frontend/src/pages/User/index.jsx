import {
    Typography, Box, Container, Button, CircularProgress
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import FoodGrid from "../../components/list/FoodGrid/index.jsx";
import OrderModal from "./Order/OrderModal/index.jsx";
import {useFoodStore} from "../../components/store/foodStore.jsx";
import FoodItemsService from "../../service/food-itemsService.js";



function FoodCardList() {
    const [selectedFood, setSelectedFood] = useState(null);
    const [orderModalOpen, setOrderModalOpen] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const { foods, loading, setFoods, setLoading } = useFoodStore();

    useEffect(() => {
        const fetchFoods = async () => {
            setLoading(true);
            try {
                const response = await FoodItemsService.getAllFoods();
                setFoods(response.data);
                setLoading(false);
            } catch {
                toast.error("Không thể tải danh sách món ăn");
                setFoods([]);
                setLoading(false);
            }
        };

        const fetchUserInfo = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (user?.token) {
                    const res = await axios.get('http://localhost:8080/api/users/profile', {
                        headers: { Authorization: `${user.tokenType} ${user.token}` }
                    });
                    setUserInfo(res.data);
                }
            } catch {
                toast.error("Không thể lấy thông tin người dùng");
            }
        };

        fetchFoods();
        fetchUserInfo();
    }, []);

    const handleOrderClick = (food) => {
        if (!localStorage.getItem('token')) return toast.error('Vui lòng đăng nhập để đặt hàng!');
        setSelectedFood(food);
        setOrderModalOpen(true);
    };

    return (
        <Container maxWidth="xl">
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                    🔥 Ưu đãi hôm nay
                </Typography>
                <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
                    Khám phá những món ăn ngon với giá ưu đãi đặc biệt
                </Typography>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <CircularProgress color="primary" />
                </Box>
            ) : (
                <FoodGrid foods={foods} onOrderClick={handleOrderClick} />
            )}

            <OrderModal
                open={orderModalOpen}
                onClose={() => setOrderModalOpen(false)}
                foodItem={selectedFood}
                userInfo={userInfo}
            />
        </Container>
    );
}

export default FoodCardList;
