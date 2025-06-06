import {
    Typography,
    Box,
    Container,
    Button,
    Stack,
    CircularProgress,
} from "@mui/material";
import { ThumbUp } from "@mui/icons-material";
import { useState, useEffect } from "react";
import axios from "axios";

function FoodCardList() {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchFoods();
    }, []);

    const fetchFoods = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/api/food-items");
            setFoods(response.data || []);
        } catch (error) {
            console.error("Error fetching foods:", error);
            setFoods([]);
        } finally {
            setLoading(false);
        }
    };

    const handleImageError = (e) => {
        e.target.src = "https://via.placeholder.com/300x200?text=Food+Image";
    };

    return (
        <Container maxWidth="xl">
            {/* Header Section */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
                    🔥 Ưu đãi hôm nay
                </Typography>
                <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem' }}>
                    Khám phá những món ăn ngon với giá ưu đãi đặc biệt
                </Typography>
            </Box>

            {/* Food Items Grid */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress sx={{ color: 'white' }} />
                </Box>
            ) : (
                <div className="food-grid">
                    {Array.isArray(foods) && foods.length > 0 ? (
                        foods.map((item) => (
                            <div key={item.id} className="food-item">
                                <div className="food-image">
                                    <img 
                                        src={item.image || "https://via.placeholder.com/300x200?text=Food+Image"} 
                                        alt={item.name}
                                        onError={handleImageError}
                                    />
                                </div>
                                <div className="food-content">
                                    <h3>{item.name}</h3>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <span className="price">{item.discountPrice?.toLocaleString('vi-VN')}đ</span>
                                        <span className="original-price">{item.price?.toLocaleString('vi-VN')}đ</span>
                                    </Stack>
                                    <div className="delivery-time">
                                        🕒 {item.deliveryTime} phút
                                    </div>
                                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            sx={{
                                                backgroundColor: '#ff6200',
                                                '&:hover': { backgroundColor: '#ff8c00' },
                                                borderRadius: 2,
                                            }}
                                        >
                                            Đặt ngay
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            sx={{
                                                borderColor: '#ff6200',
                                                color: '#ff6200',
                                                '&:hover': {
                                                    borderColor: '#ff8c00',
                                                    color: '#ff8c00',
                                                    backgroundColor: 'rgba(255, 98, 0, 0.1)'
                                                },
                                                minWidth: '50px'
                                            }}
                                        >
                                            <ThumbUp sx={{ fontSize: 18 }} />
                                        </Button>
                                    </Stack>
                                </div>
                            </div>
                        ))
                    ) : (
                        <Box sx={{ width: '100%', textAlign: 'center', py: 4, color: 'white' }}>
                            <Typography variant="h6">
                                Không có món ăn nào
                            </Typography>
                            <Button
                                variant="contained"
                                sx={{
                                    mt: 2,
                                    backgroundColor: '#ff6200',
                                    '&:hover': { backgroundColor: '#ff8c00' }
                                }}
                            >
                                Khám phá thêm
                            </Button>
                        </Box>
                    )}
                </div>
            )}

            {/* Load More Button */}
            {foods.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Button
                        variant="outlined"
                        size="large"
                        sx={{
                            borderRadius: 3,
                            px: 4,
                            py: 1.5,
                            borderColor: '#ff6200',
                            color: '#ff6200',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 98, 0, 0.1)',
                                borderColor: '#ff8c00',
                                color: '#ff8c00'
                            }
                        }}
                    >
                        Xem thêm món ăn
                    </Button>
                </Box>
            )}
        </Container>
    );
}

export default FoodCardList;