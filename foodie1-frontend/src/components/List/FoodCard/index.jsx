// Thư viện MUI, các component giao diện
import {
    Box, Button, Typography, useTheme,
    Snackbar, Alert
} from "@mui/material";

import { useState } from 'react';
import AddToCartButton from './AddToCartButton.jsx';

// Component chính nhận props: food, onOrderClick
export default function FoodCard({ food, onOrderClick }) {
    const theme = useTheme(); // lấy theme từ MUI để dùng màu sắc, border,...

    // Một số biến style tuỳ biến theo theme
    const borderRadius = theme.shape.borderRadius * 2.5 || 20;
    const primaryMain = theme.palette.primary.main;
    const primaryDark = theme.palette.primary.dark;
    const fontFamily = theme.typography.fontFamily;
    const shadow = theme.shadows[2];
    const shadowHover = theme.shadows[6];
    const textSecondary = theme.palette.text.secondary;

    // State snackbar để hiển thị thông báo khi thêm giỏ hàng
    const [snackbar, setSnackbar] = useState(false);

    // Nếu ảnh lỗi, dùng ảnh mặc định
    const handleImageError = (e) => {
        e.target.src = "https://placehold.co/300x200/png?text=Food+Image";
    };

    // Xử lý đường dẫn ảnh: nếu là URL tuyệt đối thì dùng luôn, nếu không thì build lại đường dẫn từ localhost
    const getFoodImageUrl = (imageUrl) => {
        if (!imageUrl) return "https://placehold.co/300x200/png?text=Food+Image";
        if (imageUrl.startsWith("http")) return imageUrl;
        return `http://localhost:8080/uploads/food/${imageUrl}`;
    };

    // Khi click "thêm vào giỏ", hiển thị snackbar
    const handleAddToCart = () => {
        setSnackbar(true);
    };

    return (
        <Box
            sx={{
                borderRadius,
                boxShadow: shadow,
                background: theme.palette.background.paper,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: 'box-shadow 0.3s, transform 0.3s',
                '&:hover': {
                    boxShadow: shadowHover,
                    transform: 'scale(1.04)',
                },
                cursor: 'pointer',
                overflow: 'hidden',
                fontFamily,
            }}
        >
            {/* Hình ảnh món ăn */}
            <Box
                sx={{
                    width: "100%",
                    height: 160,
                    overflow: "hidden",
                    borderTopLeftRadius: borderRadius,
                    borderTopRightRadius: borderRadius,
                }}
            >
                <img
                    src={getFoodImageUrl(food.imageUrl)}
                    alt={food.name}
                    onError={handleImageError}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                    }}
                />
            </Box>

            {/* Phần nội dung của card */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', p: 2 }}>

                {/* Tên món ăn */}
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {food.name}
                </Typography>

                {/* Giá tiền + giảm giá (nếu có) */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    {food.discountPrice ? (
                        <>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: textSecondary,
                                    textDecoration: "line-through",
                                    fontWeight: 500
                                }}
                            >
                                {food.price.toLocaleString()}đ
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    background: `linear-gradient(135deg, ${primaryMain} 0%, ${primaryDark} 100%)`,
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    fontSize: "1.2rem"
                                }}
                            >
                                {food.discountPrice.toLocaleString()}đ
                            </Typography>
                        </>
                    ) : (
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                background: `linear-gradient(135deg, ${primaryMain} 0%, ${primaryDark} 100%)`,
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                fontSize: "1.2rem"
                            }}
                        >
                            {food.price.toLocaleString()}đ
                        </Typography>
                    )}
                </Box>

                {/* Thời gian giao và tên nhà hàng */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="caption" sx={{ color: textSecondary }}>
                        ⏱ {food.deliveryTime} - {food.deliveryTime + 10}p
                    </Typography>
                    <Typography variant="caption" sx={{ color: textSecondary }}>
                        🏪 {food.restaurant}
                    </Typography>
                </Box>

                {/* Nút ĐẶT MÓN */}
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={e => {
                        e.stopPropagation(); // Ngăn sự kiện nổi lên
                        onOrderClick(food);  // Gọi callback gửi food về parent (thường là để mở modal đặt món)
                    }}
                    sx={{
                        fontWeight: 700,
                        borderRadius: theme.shape.borderRadius * 1.5,
                        px: 2,
                        py: 1,
                        fontSize: "1rem",
                        textTransform: "none",
                        mt: "auto"
                    }}
                >
                    Đặt món
                </Button>

                {/* Nút THÊM VÀO GIỎ HÀNG */}
                <Box sx={{ mt: 2 }}>
                    <AddToCartButton
                        foodItem={food}
                        quantity={1}
                        fullWidth={true}
                        onClick={e => {
                            e.stopPropagation(); // Ngăn sự kiện nổi lên
                            handleAddToCart();   // Gọi hàm hiển thị snackbar
                        }}
                    />
                </Box>
            </Box>

            {/* Snackbar: thông báo nhỏ sau khi thêm giỏ */}
            <Snackbar
                open={snackbar}
                autoHideDuration={2000}
                onClose={() => setSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity="success" sx={{ width: '100%' }}>
                    Đã thêm vào giỏ hàng!
                </Alert>
            </Snackbar>
        </Box>
    );
}
