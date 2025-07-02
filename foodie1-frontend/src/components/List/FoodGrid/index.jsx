// File: components/FoodGrid.jsx
import { Box, Typography, Button } from "@mui/material";
import FoodCard from "../FoodCard/index.jsx";


export default function FoodGrid({ foods, onOrderClick }) {
    return (
        <Box className="food-grid">
            {foods?.length ? (
                foods.map((food, i) => (
                    <FoodCard key={i} food={food} onOrderClick={onOrderClick} />
                ))
            ) : (
                <Box sx={{ textAlign: 'center', py: 4, color: 'white' }}>
                    <Typography variant="h6">Không tìm thấy món ăn nào</Typography>
                    <Button
                        variant="contained"
                        onClick={() => window.location.reload()}
                        sx={{ mt: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', fontWeight: 700, borderRadius: '18px', px: 3, py: 1, boxShadow: 2, textTransform: 'none', fontSize: '1rem', '&:hover': { background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)', color: '#fff', boxShadow: 4 } }}
                    >
                        Tải lại trang
                    </Button>
                </Box>
            )}
        </Box>
    );
}
