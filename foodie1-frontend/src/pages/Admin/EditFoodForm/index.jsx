import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, MenuItem, Typography, FormControl, InputLabel, Select, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import AdminService from "../../../service/adminservice.js";
import FoodItemsService from "../../../service/food-itemsService.js";

function EditFoodForm({ open, onClose, food, onEditSuccess }) {
    const [foodData, setFoodData] = useState({
        name: '',
        price: '',
        discountPrice: '',
        restaurant: '',
        deliveryTime: '',
        categoryId: '',
        image: null,
    });

    useEffect(() => {
        if (food) {
            setFoodData({
                name: food.name || '',
                price: food.price || '',
                discountPrice: food.discountPrice || '',
                restaurant: food.restaurant || '',
                deliveryTime: food.deliveryTime || '',
                categoryId: food.category?.id?.toString() || '',
                image: null,
            });
        }
    }, [food]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFoodData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFoodData(prev => ({
                ...prev,
                image: e.target.files[0]
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!foodData.name || !foodData.price || !foodData.restaurant || !foodData.deliveryTime || !foodData.categoryId) {
            toast.error('Vui lòng điền đầy đủ các trường bắt buộc');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', foodData.name);
            formData.append('price', foodData.price);
            if (foodData.discountPrice) {
                formData.append('discountPrice', foodData.discountPrice);
            }
            formData.append('restaurant', foodData.restaurant);
            formData.append('deliveryTime', foodData.deliveryTime);
            formData.append('categoryId', foodData.categoryId);
            if (foodData.image) {
                formData.append('image', foodData.image);
            }

            const response = await FoodItemsService.updateFood(food.id, formData);
            
            // Tạo object đầy đủ với category
            const updatedFood = {
                ...response.data,
                category: {
                    id: parseInt(foodData.categoryId),
                    name: foodData.categoryId === '1' ? 'Đồ ăn' : 'Đồ uống'
                }
            };
            
            toast.success('Cập nhật món ăn thành công');
            onEditSuccess(updatedFood);
            onClose();
        } catch (error) {
            console.error('Lỗi khi cập nhật món ăn:', error);
            toast.error('Không thể cập nhật món ăn');
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle sx={{ m: 0, p: 2, bgcolor: 'primary.main', color: 'white' }}>
                Chỉnh sửa món ăn
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: 'white'
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Box sx={{ p: 2 }}>
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Tên món ăn"
                                name="name"
                                value={foodData.name}
                                onChange={handleChange}
                                required
                                fullWidth
                            />
                            <TextField
                                label="Giá (VND)"
                                name="price"
                                type="number"
                                value={foodData.price}
                                onChange={handleChange}
                                required
                                fullWidth
                            />
                            <TextField
                                label="Giá khuyến mãi (VND)"
                                name="discountPrice"
                                type="number"
                                value={foodData.discountPrice}
                                onChange={handleChange}
                                fullWidth
                            />
                            <TextField
                                label="Nhà hàng"
                                name="restaurant"
                                value={foodData.restaurant}
                                onChange={handleChange}
                                required
                                fullWidth
                            />
                            <TextField
                                label="Thời gian giao (phút)"
                                name="deliveryTime"
                                type="number"
                                value={foodData.deliveryTime}
                                onChange={handleChange}
                                required
                                fullWidth
                            />
                            <FormControl fullWidth required>
                                <InputLabel>Danh mục</InputLabel>
                                <Select
                                    name="categoryId"
                                    value={foodData.categoryId}
                                    onChange={handleChange}
                                    label="Danh mục"
                                >
                                    <MenuItem value="1">Đồ ăn</MenuItem>
                                    <MenuItem value="2">Đồ uống</MenuItem>
                                </Select>
                            </FormControl>
                            <Button
                                variant="contained"
                                component="label"
                                sx={{ mt: 2 }}
                            >
                                Chọn ảnh mới
                                <input
                                    type="file"
                                    hidden
                                    onChange={handleFileChange}
                                    accept="image/*"
                                />
                            </Button>
                            {foodData.image && (
                                <Typography>
                                    Đã chọn: {foodData.image.name}
                                </Typography>
                            )}
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                sx={{ mt: 2 }}
                            >
                                Cập nhật
                            </Button>
                        </Box>
                    </form>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

export default EditFoodForm; 