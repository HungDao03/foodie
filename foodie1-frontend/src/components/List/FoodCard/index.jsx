import { Box, Button, Typography, useTheme } from "@mui/material";

export default function FoodCard({ food, onOrderClick }) {
    const theme = useTheme();
    const borderRadius = theme.shape.borderRadius * 2.5 || 20; // Ưu tiên theme, fallback 20
    const primaryMain = theme.palette.primary.main;
    const primaryDark = theme.palette.primary.dark;
    const fontFamily = theme.typography.fontFamily;
    const shadow = theme.shadows[2];
    const shadowHover = theme.shadows[6];
    const textSecondary = theme.palette.text.secondary;

    const handleImageError = (e) => {
        e.target.src = "https://placehold.co/300x200/png?text=Food+Image";
    };

    const getFoodImageUrl = (imageUrl) => {
        if (!imageUrl) return "https://placehold.co/300x200/png?text=Food+Image";
        if (imageUrl.startsWith("http")) return imageUrl;
        return `http://localhost:8080/uploads/food/${imageUrl}`;
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
            {/* Ảnh món ăn */}
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
            {/* Nội dung */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', p: 2 }}>
                {/* Tên món */}
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontFamily }}>
                    {food.name}
                </Typography>
                {/* Giá và khuyến mãi */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    {food.discountPrice ? (
                        <>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: textSecondary,
                                    textDecoration: "line-through",
                                    fontWeight: 500,
                                    fontFamily
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
                                    fontSize: "1.2rem",
                                    fontFamily
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
                                fontSize: "1.2rem",
                                fontFamily
                            }}
                        >
                            {food.price.toLocaleString()}đ
                        </Typography>
                    )}
                </Box>
                {/* Thời gian giao & Nhà hàng */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="caption" sx={{ color: textSecondary, fontFamily }}>
                        ⏱ {food.deliveryTime} - {food.deliveryTime + 10}p
                    </Typography>
                    <Typography variant="caption" sx={{ color: textSecondary, fontFamily }}>
                        🏪 {food.restaurant}
                    </Typography>
                </Box>
                {/* Nút đặt món */}
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={e => { e.stopPropagation(); onOrderClick(food); }}
                    sx={{
                        fontWeight: 700,
                        borderRadius: theme.shape.borderRadius * 1.5,
                        px: 2,
                        py: 1,
                        fontSize: "1rem",
                        textTransform: "none",
                        mt: "auto",
                        fontFamily,
                    }}
                >
                    Đặt món
                </Button>
            </Box>
        </Box>
    );
}