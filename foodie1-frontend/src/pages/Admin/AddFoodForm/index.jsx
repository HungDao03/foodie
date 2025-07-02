import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    IconButton,
    Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AdminService from '../../../service/adminservice';
import { toast } from 'react-toastify';
import FoodItemsService from "../../../service/food-itemsService.js";

function AddFoodForm({ open, onClose, onAddSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        discountPrice: '',
        restaurant: '',
        deliveryTime: '',
        categoryId: '',
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                image: file
            }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await FoodItemsService.addFood(formData);
            toast.success('Thêm món ăn thành công!');
            onAddSuccess(response.data);
            handleReset();
        } catch (error) {
            toast.error('Không thể thêm món ăn');
            console.error('Lỗi khi thêm món ăn:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            name: '',
            price: '',
            discountPrice: '',
            restaurant: '',
            deliveryTime: '',
            categoryId: '',
            image: null
        });
        setImagePreview(null);
        onClose();
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px'
                }
            }}
        >
            <DialogTitle sx={{ 
                m: 0, 
                p: 2, 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                    Thêm món ăn mới
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent dividers>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            required
                            label="Tên món ăn"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            fullWidth
                        />

                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                            <TextField
                                required
                                label="Giá (VNĐ)"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleInputChange}
                            />
                            <TextField
                                label="Giá khuyến mãi (VNĐ)"
                                name="discountPrice"
                                type="number"
                                value={formData.discountPrice}
                                onChange={handleInputChange}
                            />
                        </Box>

                        <TextField
                            required
                            label="Nhà hàng"
                            name="restaurant"
                            value={formData.restaurant}
                            onChange={handleInputChange}
                        />

                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                            <TextField
                                required
                                label="Thời gian giao (phút)"
                                name="deliveryTime"
                                type="number"
                                value={formData.deliveryTime}
                                onChange={handleInputChange}
                            />
                            <FormControl required>
                                <InputLabel>Danh mục</InputLabel>
                                <Select
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleInputChange}
                                    label="Danh mục"
                                >
                                    <MenuItem value={1}>Đồ ăn</MenuItem>
                                    <MenuItem value={2}>Đồ uống</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box sx={{ mt: 2 }}>
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="image-upload"
                                type="file"
                                onChange={handleImageChange}
                            />
                            <label htmlFor="image-upload">
                                <Button
                                    variant="outlined"
                                    component="span"
                                    startIcon={<CloudUploadIcon />}
                                    sx={{ width: '100%', height: '100px' }}
                                >
                                    {imagePreview ? 'Thay đổi ảnh' : 'Tải ảnh lên'}
                                </Button>
                            </label>
                            {imagePreview && (
                                <Box sx={{ mt: 2, position: 'relative' }}>
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        style={{
                                            width: '100%',
                                            height: '200px',
                                            objectFit: 'cover',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <IconButton
                                        onClick={() => {
                                            setImagePreview(null);
                                            setFormData(prev => ({ ...prev, image: null }));
                                        }}
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: 'rgba(0, 0, 0, 0.7)'
                                            }
                                        }}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleReset} color="inherit">
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{
                            backgroundColor: '#ff6200',
                            '&:hover': {
                                backgroundColor: '#ff7417',
                            }
                        }}
                    >
                        {loading ? 'Đang thêm...' : 'Thêm món ăn'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default AddFoodForm;