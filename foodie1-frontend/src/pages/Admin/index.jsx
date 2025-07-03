import React, { useState, useEffect } from 'react';
import { Typography, Box, Container, CircularProgress, Button, Stack, Avatar } from '@mui/material';

import { toast } from 'react-toastify';
import AddIcon from '@mui/icons-material/Add';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import './admin.css';
import AddFoodForm from "./AddFoodForm/index.jsx";
import EditFoodForm from "./EditFoodForm/index.jsx";
import HeaderAdmin from "./HeaderAdmin/index.jsx";
import FoodItemsService from "../../service/food-itemsService.js";

function AdminPage() {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingFood, setEditingFood] = useState(null);
    const [isAddFormOpen, setIsAddFormOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Load user info from localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const userData = JSON.parse(userStr);
                setUser(userData);
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }

        const loadFoods = async () => {
            try {
                const response = await FoodItemsService.getAllFoods();
                setFoods(response.data);
            } catch (error) {
                toast.error('Không thể tải danh sách món ăn');
                console.error('Lỗi khi lấy danh sách món ăn:', error);
            } finally {
                setLoading(false);
            }
        };
        loadFoods();
    }, []);

    const reloadFoods = async () => {
        try {
            const response = await FoodItemsService.getAllFoods();
            setFoods(response.data);
        } catch (error) {
            toast.error('Không thể tải lại danh sách món ăn');
            console.error('Lỗi khi tải lại danh sách món ăn:', error);
        }
    };

    const handleLogout = async () => {
        try {
            toast.success('Đăng xuất thành công!');
        } catch (error) {
            console.error('Lỗi khi đăng xuất:', error);
            toast.error('Có lỗi xảy ra khi đăng xuất!');
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Get user's initials for avatar fallback
    const getInitials = (name) => {
        if (!name) return 'A';
        return name.split(' ').map(word => word[0]).join('').toUpperCase();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa món ăn này?')) {
            try {
                await FoodItemsService.deleteFood(id);
                setFoods(foods.filter((food) => food.id !== id));
                toast.success('Xóa món ăn thành công');
            } catch (error) {
                toast.error('Không thể xóa món ăn');
                console.error('Lỗi khi xóa món ăn:', error);
            }
        }
    };

    const handleAddSuccess = (newFood) => {
        setFoods((prev) => [...prev, newFood]);
    };

    const handleEditSuccess = (updatedFood) => {
        console.log('Updated food data:', updatedFood);
        reloadFoods();
    };

    const getFoodImageUrl = (imageUrl) => {
        if (!imageUrl) return "https://placehold.co/300x200/png?text=Food+Image";
        if (imageUrl.startsWith("http")) return imageUrl;
        return `http://localhost:8080/uploads/food/${imageUrl}`;
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    backgroundColor: '#1a1a1a',
                }}
            >
                <CircularProgress sx={{ color: 'white' }} />
            </Box>
        );
    }

    return (
        <div className="admin-container">
            <div className="admin-background" />
            
            {/* Header Component */}
            <HeaderAdmin 
                user={user}
                onToggleSidebar={toggleSidebar}
                onLogout={handleLogout}
            />

            {/* Sidebar */}
            <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <nav className="admin-nav">
                    <div className="admin-nav-item">
                        <a href="#" className="admin-nav-link active">
                            <div className="admin-nav-icon">
                                <DashboardIcon />
                            </div>
                            <span>Dashboard</span>
                        </a>
                    </div>
                    <div className="admin-nav-item">
                        <a href="#" className="admin-nav-link">
                            <div className="admin-nav-icon">
                                <RestaurantMenuIcon />
                            </div>
                            <span>Món ăn</span>
                        </a>
                    </div>
                    <div className="admin-nav-item">
                        <a href="#" className="admin-nav-link">
                            <div className="admin-nav-icon">
                                <PeopleIcon />
                            </div>
                            <span>Người dùng</span>
                        </a>
                    </div>
                    <div className="admin-nav-item">
                        <a href="#" className="admin-nav-link">
                            <div className="admin-nav-icon">
                                <SettingsIcon />
                            </div>
                            <span>Cài đặt</span>
                        </a>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <Container maxWidth="xl">
                    <Box sx={{ 
                        mb: 4,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: 2
                    }}>
                        <div>
                            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
                                🍽️ Quản lý món ăn
                            </Typography>
                            <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem' }}>
                                Danh sách món ăn trong thực đơn
                            </Typography>
                        </div>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setIsAddFormOpen(true)}
                            sx={{
                                backgroundColor: '#ff6200',
                                '&:hover': {
                                    backgroundColor: '#ff7417',
                                },
                                height: '48px',
                                borderRadius: '24px',
                                px: 3,
                                fontSize: '1rem',
                                textTransform: 'none',
                                fontWeight: 500
                            }}
                        >
                            Thêm món ăn
                        </Button>
                    </Box>

                    <div className="food-grid">
                        {foods.length > 0 ? (
                            foods.map((food) => (
                                <div key={food.id} className="food-item">
                                    <div className="food-image">
                                        <img
                                            src={getFoodImageUrl(food.imageUrl)}
                                            alt={food.name}
                                            onError={(e) => {
                                                e.target.src = 'https://placehold.co/300x200/png?text=Food+Image';
                                            }}
                                        />
                                    </div>
                                    <div className="food-content">
                                        <h3>{food.name}</h3>
                                        <div>
                                            <span className="price">{food.price.toLocaleString()}đ</span>
                                            {food.discountPrice > 0 && (
                                                <span className="original-price">{food.discountPrice.toLocaleString()}đ</span>
                                            )}
                                            <div className="food-info">
                                                <small>Nhà hàng: {food.restaurant}</small>
                                                <br />
                                                <small>Thời gian giao: {food.deliveryTime} phút</small>
                                                <br />
                                                <small>Danh mục: {food.category?.name || 'Chưa có'}</small>
                                            </div>
                                            <Stack direction="row" spacing={1} mt={1}>
                                                <Button
                                                    variant="outlined"
                                                    onClick={() => setEditingFood(food)}
                                                    sx={{
                                                        borderColor: '#2196f3',
                                                        color: '#2196f3',
                                                        '&:hover': {
                                                            borderColor: '#2196f3',
                                                            backgroundColor: 'rgba(33, 150, 243, 0.1)',
                                                        },
                                                    }}
                                                >
                                                    Sửa
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    onClick={() => handleDelete(food.id)}
                                                    sx={{
                                                        borderColor: '#ff0000',
                                                        color: '#ff0000',
                                                        '&:hover': {
                                                            borderColor: '#ff0000',
                                                            backgroundColor: 'rgba(255, 0, 0, 0.1)',
                                                        },
                                                    }}
                                                >
                                                    Xóa
                                                </Button>
                                            </Stack>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <Typography variant="h6" sx={{ color: 'white', textAlign: 'center', width: '100%' }}>
                                Không có món ăn nào
                            </Typography>
                        )}
                    </div>
                </Container>
            </main>

            <AddFoodForm 
                open={isAddFormOpen}
                onClose={() => setIsAddFormOpen(false)}
                onAddSuccess={handleAddSuccess} 
            />

            <EditFoodForm
                open={!!editingFood}
                onClose={() => setEditingFood(null)}
                food={editingFood}
                onEditSuccess={handleEditSuccess}
            />
        </div>
    );
}

export default AdminPage;