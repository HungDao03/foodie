import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Box,
} from "@mui/material";
import { AccessTime, LocationOn, Phone, Whatshot } from "@mui/icons-material";
import { useEffect, useState } from "react";

import FoodItemsService from "../../service/food-itemsService.js";
import LoginModal from '../../components/LoginModal';
import RegisterModal from '../../components/RegisterModal';

export default function Homepage() {
    const [category1Foods, setCategory1Foods] = useState([]);
    const [category2Foods, setCategory2Foods] = useState([]);
    const [openLogin, setOpenLogin] = useState(false);
    const [openRegister, setOpenRegister] = useState(false);
    const [showAllCategory1, setShowAllCategory1] = useState(false);
    const [showAllCategory2, setShowAllCategory2] = useState(false);


    // Fetch món ăn theo danh mục khi component mount
    useEffect(() => {
        const fetchFoodsByCategory = async () => {
            try {
                // Lấy món ăn danh mục 1
                const response1 = await FoodItemsService.getFoodsByCategory(1);
                setCategory1Foods(response1.data);

                // Lấy món ăn danh mục 2
                const response2 = await FoodItemsService.getFoodsByCategory(2);
                setCategory2Foods(response2.data);
            } catch (error) {
                console.error("Lỗi khi lấy món ăn theo danh mục:", error);
            }
        };
        fetchFoodsByCategory();
    }, []);

    // Mở/đóng modal
    const handleOpenLogin = () => setOpenLogin(true);
    const handleCloseLogin = () => setOpenLogin(false);
    const handleOpenRegister = () => setOpenRegister(true);
    const handleCloseRegister = () => setOpenRegister(false);

    // Chuyển đổi giữa modal login/register
    const switchToRegister = () => {
        handleCloseLogin();
        handleOpenRegister();
    };
    const switchToLogin = () => {
        handleCloseRegister();
        handleOpenLogin();
    };

    return (
        <>
            {/* Header */}
            <AppBar position="sticky" sx={{ bgcolor: "white", boxShadow: 1 }}>
                <Toolbar>
                    <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
                        <img src="/logofoodie.png" alt="Foodie Logo" style={{ width: 70, height: 70, marginRight: 6 }} />
                    </Box>

                    <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3, mr: 3 }}>
                        <Button sx={{ color: "black" }}>Trang chủ</Button>
                        <Button sx={{ color: "black" }}>Liên hệ</Button>
                        <Button sx={{ color: "black" }} onClick={handleOpenLogin}>Đăng nhập</Button>
                        <Button sx={{ color: "black" }} onClick={handleOpenRegister}>Đăng ký</Button>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Modal đăng nhập / đăng ký */}
            <LoginModal open={openLogin} onClose={handleCloseLogin} onRegisterClick={switchToRegister} />
            <RegisterModal open={openRegister} onClose={handleCloseRegister} onLoginClick={switchToLogin} />

            {/* Hero section */}
            <Box sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", py: 6 }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: "center", maxWidth: 600, mx: "auto" }}>
                        <Typography variant="h3" sx={{ mb: 2, fontWeight: 700, color: "#fff", textShadow: "0 2px 8px rgba(60,40,120,0.15)" }}>
                            Khám phá{" "}
                            <Box component="span" sx={{
                                background: "linear-gradient(135deg, #fff 0%, #e0e7ff 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                fontWeight: 800,
                                textShadow: "0 2px 8px #6a4190"
                            }}>
                                hương vị
                            </Box>{" "}đặc sắc
                        </Typography>

                        <Typography variant="body1" sx={{ color: "#f3f4f6", mb: 3 }}>
                            Thưởng thức những món ăn ngon nhất với nguyên liệu tươi ngon mỗi ngày
                        </Typography>
                        {/*<Typography variant="body1" sx={{ color: "#f3f4f6", mb: 3 }}>*/}
                        {/*    Giao món nóng hổi chỉ sau 20 phút*/}
                        {/*</Typography>*/}

                        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
                            <Button
                                onClick={handleOpenLogin}
                                variant="contained"
                                size="large"
                                sx={{
                                    background: "linear-gradient(135deg, #fff 0%, #e0e7ff 100%)",
                                    color: "#764ba2",
                                    fontWeight: 800,
                                    boxShadow: "0 6px 24px rgba(106,65,144,0.25)",
                                    borderRadius: "18px",
                                    px: 5,
                                    py: 2,
                                    fontSize: "1.2rem",
                                    letterSpacing: "1px",
                                    textShadow: "0 2px 8px #fff",
                                    '&:hover': {
                                        background: "linear-gradient(135deg, #e0e7ff 0%, #fff 100%)",
                                        color: "#5a6fd8"
                                    }
                                }}
                            >
                                Đặt món ngay
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Danh sách món ăn */}
            <Box sx={{ py: 6 }}>
                <Container maxWidth="lg">
                    {/* Hàng 1 - Danh mục 1 */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Whatshot sx={{ color: 'orangered', fontSize: '2.5rem' }} />
                            <Typography variant="h4" sx={{ fontWeight: 600 }}>
                                Best Seller
                            </Typography>
                        </Box>
                        {category1Foods.length > 4 && (
                            <Button
                                onClick={() => setShowAllCategory1(!showAllCategory1)}
                                sx={{
                                    fontWeight: 600,
                                    color: "#667eea",
                                    '&:hover': {
                                        backgroundColor: 'rgba(102, 126, 234, 0.04)',
                                    }
                                }}
                            >
                                {showAllCategory1 ? 'Thu gọn' : 'Xem tất cả'}
                            </Button>
                        )}
                    </Box>

                    <Grid container spacing={3} sx={{mb: 6}}>
                        {(showAllCategory1 ? category1Foods : category1Foods.slice(0, 4)).map((dish) => (
                            <Grid item xs={12} sm={6} md={3} key={dish.id}>
                                <Card
                                    sx={{
                                        height: "100%",
                                        borderRadius: "20px",
                                        boxShadow: 2,
                                        '&:hover': { boxShadow: 4 }
                                    }}
                                >
                                    <CardMedia component="img" height="160" image={dish.imageUrl} alt={dish.name} />
                                    <CardContent sx={{ p: 2 }}>
                                        <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 600, mb: 1 }}>
                                            {dish.name}
                                        </Typography>

                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                            <Typography variant="h6" sx={{
                                                fontWeight: 700,
                                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                                WebkitBackgroundClip: "text",
                                                WebkitTextFillColor: "transparent",
                                                fontSize: "1.2rem"
                                            }}>
                                                {dish.price?.toLocaleString("vi-VN")}đ
                                            </Typography>

                                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                <AccessTime sx={{ fontSize: 14, color: "gray" }} />
                                                <Typography variant="caption" sx={{ color: "gray" }}>
                                                    {dish.deliveryTime} phút
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <Typography variant="body2" sx={{ color: "gray" }}>
                                                {dish.restaurant}
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                sx={{
                                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                                    color: "#fff",
                                                    fontWeight: 700,
                                                    borderRadius: "12px",
                                                    px: 2,
                                                    py: 0.5,
                                                    fontSize: "1rem",
                                                    '&:hover': {
                                                        background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)"
                                                    }
                                                }}
                                            >
                                                Đặt món
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Hàng 2 - Danh mục 2 */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>

                        {category2Foods.length > 4 && (
                            <Button
                                onClick={() => setShowAllCategory2(!showAllCategory2)}
                                sx={{
                                    fontWeight: 600,
                                    color: "#667eea",
                                    '&:hover': {
                                        backgroundColor: 'rgba(102, 126, 234, 0.04)',
                                    }
                                }}
                            >
                                {showAllCategory2 ? 'Thu gọn' : 'Xem tất cả'}
                            </Button>
                        )}
                    </Box>

                    <Grid container spacing={3}>
                        {(showAllCategory2 ? category2Foods : category2Foods.slice(0, 4)).map((dish) => (
                            <Grid item xs={12} sm={6} md={3} key={dish.id}>
                                <Card
                                    sx={{
                                        height: "100%",
                                        borderRadius: "20px",
                                        boxShadow: 2,
                                        '&:hover': { boxShadow: 4 }
                                    }}
                                >
                                    <CardMedia component="img" height="160" image={dish.imageUrl} alt={dish.name} />
                                    <CardContent sx={{ p: 2 }}>
                                        <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 600, mb: 1 }}>
                                            {dish.name}
                                        </Typography>

                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                            <Typography variant="h6" sx={{
                                                fontWeight: 700,
                                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                                WebkitBackgroundClip: "text",
                                                WebkitTextFillColor: "transparent",
                                                fontSize: "1.2rem"
                                            }}>
                                                {dish.price?.toLocaleString("vi-VN")}đ
                                            </Typography>

                                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                <AccessTime sx={{ fontSize: 14, color: "gray" }} />
                                                <Typography variant="caption" sx={{ color: "gray" }}>
                                                    {dish.deliveryTime} phút
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <Typography variant="body2" sx={{ color: "gray" }}>
                                                {dish.restaurant}
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                sx={{
                                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                                    color: "#fff",
                                                    fontWeight: 700,
                                                    borderRadius: "12px",
                                                    px: 2,
                                                    py: 0.5,
                                                    fontSize: "1rem",
                                                    '&:hover': {
                                                        background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)"
                                                    }
                                                }}
                                            >
                                                Đặt món
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Thống kê */}
            <Box sx={{ py: 4, bgcolor: "primary.main", color: "white" }}>
                <Container maxWidth="lg">
                    <Grid container spacing={2} sx={{ textAlign: "center" }}>
                        <Grid item xs={3}><Typography variant="h4" fontWeight={700}>1K+</Typography><Typography variant="body2">Khách hàng</Typography></Grid>
                        <Grid item xs={3}><Typography variant="h4" fontWeight={700}>150+</Typography><Typography variant="body2">Món ăn</Typography></Grid>
                        <Grid item xs={3}><Typography variant="h4" fontWeight={700}>50+</Typography><Typography variant="body2">Đầu bếp</Typography></Grid>
                        <Grid item xs={3}><Typography variant="h4" fontWeight={700}>4.8</Typography><Typography variant="body2">Đánh giá</Typography></Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Footer */}
            <Box sx={{ py: 4, bgcolor: "#111827", color: "white" }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                <img src="/logofoodie.png" alt="Foodie Logo" style={{ width: 70, height: 70, marginRight: 6 }} />
                                <Typography variant="h6" fontWeight={700}>Foodie</Typography>
                            </Box>
                            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                                Trải nghiệm ẩm thực tuyệt vời
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                <LocationOn sx={{ fontSize: 16 }} />
                                <Typography variant="body2">123 Đường ABC, Q1, TP.HCM</Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Phone sx={{ fontSize: 16 }} />
                                <Typography variant="body2">0123 456 789</Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={4} sx={{ textAlign: { xs: "center", md: "right" } }}>
                            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)" }}>
                                © 2024 Foodie. All rights reserved.
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    );
}
