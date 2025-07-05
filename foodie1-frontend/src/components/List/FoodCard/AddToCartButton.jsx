import React, { useState } from 'react';
import { Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CartService from '../../../service/cartService.js';
import { getCurrentUserId, isAuthenticated } from '../../../utils/authUtils.js';
import { toast } from 'react-toastify';

const AddToCartButton = ({ foodItem, quantity = 1, variant = "contained", size = "medium", fullWidth = false }) => {
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      
      // Kiểm tra user đã đăng nhập chưa
      if (!isAuthenticated()) {
        toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng');
        return;
      }
      
      const userId = getCurrentUserId();
      await CartService.addItemToCart(userId, foodItem.id, quantity);
      toast.success('Đã thêm vào giỏ hàng!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Không thể thêm vào giỏ hàng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      color="primary"
      startIcon={<ShoppingCartIcon />}
      onClick={handleAddToCart}
      disabled={loading}
      size={size}
      fullWidth={fullWidth}
      sx={{ 
        fontWeight: 600,
        borderRadius: 2,
        textTransform: 'none'
      }}
    >
      {loading ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
    </Button>
  );
};

export default AddToCartButton; 