import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Radio,
  Checkbox,
  FormControlLabel,
  IconButton
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { toast } from 'react-toastify';
import CartService from '../../../service/cartService';
import { getCurrentUserId, isAuthenticated } from '../../../utils/authUtils';

/**
 * CartPage Component - Quản lý giỏ hàng của người dùng
 * 
 * Chức năng chính:
 * - Hiển thị danh sách món ăn trong giỏ hàng
 * - Cho phép chọn từng món hoặc tất cả món
 * - Cập nhật số lượng món ăn
 * - Xóa món ăn khỏi giỏ hàng
 * - Đặt hàng từng món hoặc tất cả món
 * - Hiển thị tổng tiền và thông tin đơn hàng
 */
export default function CartPage() {
  // State quản lý dữ liệu giỏ hàng
  const [cart, setCart] = useState({ cartItems: [], totalAmount: 0, totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [note, setNote] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  // Lấy userId của user hiện tại
  const userId = getCurrentUserId();

  // Load giỏ hàng khi component mount
  useEffect(() => {
    if (userId) {
      loadCart();
    }
  }, [userId]);

  // Reset selected items khi cart thay đổi
  useEffect(() => {
    setSelectedItems([]);
  }, [cart.cartItems]);

  /**
   * Tải dữ liệu giỏ hàng từ backend
   */
  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await CartService.getCart(userId);
      setCart(response.data);
    } catch (error) {
      console.error('Error loading cart:', error);
      toast.error('Không thể tải giỏ hàng');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Xóa một món ăn khỏi giỏ hàng
   * @param {number} foodItemId - ID của món ăn cần xóa
   */
  const handleRemove = async (foodItemId) => {
    try {
      await CartService.removeItemFromCart(userId, foodItemId);
      await loadCart(); // Reload cart sau khi xóa
      toast.success('Đã xóa món ăn khỏi giỏ hàng');
    } catch (error) {
      toast.error('Không thể xóa món ăn');
    }
  };

  /**
   * Cập nhật số lượng món ăn trong giỏ hàng
   * @param {number} foodItemId - ID của món ăn
   * @param {number} newQuantity - Số lượng mới
   */
  const handleUpdateQuantity = async (foodItemId, newQuantity) => {
    try {
      await CartService.updateCartItemQuantity(userId, foodItemId, newQuantity);
      await loadCart(); // Reload cart sau khi cập nhật
    } catch (error) {
      toast.error('Không thể cập nhật số lượng');
    }
  };

  /**
   * Đặt hàng một món ăn cụ thể
   * @param {Object} item - Thông tin món ăn
   */
  const handleOrder = async (item) => {
    try {
      await CartService.removeItemFromCart(userId, item.foodItemId);
      await loadCart();
      setMessage(`Đã xác nhận đặt món: ${item.foodItemName}`);
      toast.success('Đặt hàng thành công!');
    } catch (error) {
      console.error('Error ordering item:', error);
      toast.error('Không thể đặt hàng');
    }
  };

  /**
   * Mở modal xác nhận đặt tất cả món ăn
   */
  const handleOrderAll = () => {
    if (cart.cartItems.length === 0) return;
    setOpenModal(true);
  };

  /**
   * Xác nhận đặt tất cả món ăn trong giỏ hàng
   */
  const handleConfirmOrderAll = async () => {
    try {
      await CartService.clearCart(userId);
      await loadCart();
      setOpenModal(false);
      toast.success('Đặt hàng thành công!');
      setNote('');
    } catch (error) {
      console.error('Error ordering all items:', error);
      toast.error('Không thể đặt hàng');
    }
  };

  /**
   * Chọn/bỏ chọn một món ăn
   * @param {number} foodItemId - ID của món ăn
   */
  const handleSelectItem = (foodItemId) => {
    setSelectedItems(prev => 
      prev.includes(foodItemId) 
        ? prev.filter(id => id !== foodItemId)
        : [...prev, foodItemId]
    );
  };

  /**
   * Chọn/bỏ chọn tất cả món ăn
   */
  const handleSelectAll = () => {
    if (selectedItems.length === cart.cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.cartItems.map(item => item.foodItemId));
    }
  };

  /**
   * Mở modal xác nhận đặt các món đã chọn
   */
  const handleOrderSelected = () => {
    if (selectedItems.length === 0) {
      toast.warning('Vui lòng chọn ít nhất một món ăn!');
      return;
    }
    setOpenModal(true);
  };

  /**
   * Xác nhận đặt các món ăn đã chọn
   */
  const handleConfirmOrderSelected = async () => {
    try {
      await CartService.removeSelectedItems(userId, selectedItems);
      await loadCart();
      setOpenModal(false);
      setSelectedItems([]);
      toast.success('Đặt hàng thành công!');
      setNote('');
    } catch (error) {
      console.error('Error ordering selected items:', error);
      toast.error('Không thể đặt hàng');
    }
  };

  /**
   * Lấy danh sách các món ăn đã chọn
   * @returns {Array} Danh sách món ăn đã chọn
   */
  const getSelectedItems = () => {
    return cart.cartItems.filter(item => selectedItems.includes(item.foodItemId));
  };

  /**
   * Tính tổng tiền của danh sách món ăn
   * @param {Array} items - Danh sách món ăn
   * @returns {number} Tổng tiền
   */
  const getTotalPrice = (items) => {
    return items.reduce((total, item) => {
      const price = item.discountPrice > 0 ? item.discountPrice : item.price;
      return total + price * item.quantity;
    }, 0);
  };

  // Thêm hàm xóa nhiều món đã chọn
  const handleRemoveSelected = async () => {
    if (selectedItems.length === 0) return;
    try {
      await CartService.removeSelectedItems(userId, selectedItems);
      await loadCart();
      setSelectedItems([]);
      toast.success('Đã xóa các món đã chọn khỏi giỏ hàng');
    } catch (error) {
      toast.error('Không thể xóa các món đã chọn');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Snackbar thông báo thành công */}
      <Snackbar
        open={!!message}
        autoHideDuration={3000}
        onClose={() => setMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%', borderRadius: 2, fontWeight: 600 }}>
          {message}
        </Alert>
      </Snackbar>

      {/* Tiêu đề trang */}
      <Typography
        variant="h4"
        sx={{ 
          mb: 4, 
          fontWeight: 'bold', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent', 
          textShadow: '0 2px 8px rgba(60,40,120,0.10)' 
        }}
      >
        Giỏ hàng của bạn
      </Typography>

      {/* Kiểm tra user đã đăng nhập chưa */}
      {!isAuthenticated() ? (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Vui lòng đăng nhập để xem giỏ hàng
          </Typography>
        </Box>
      ) : loading ? (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Đang tải giỏ hàng...
          </Typography>
        </Box>
      ) : cart.cartItems.length === 0 ? (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Giỏ hàng của bạn đang trống
          </Typography>
        </Box>
      ) : (
        <>
          {/* Bảng hiển thị danh sách món ăn */}
          <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 4, boxShadow: '0 8px 32px rgba(102,126,234,0.10)' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedItems.length === cart.cartItems.length && cart.cartItems.length > 0}
                          indeterminate={selectedItems.length > 0 && selectedItems.length < cart.cartItems.length}
                          onChange={handleSelectAll}
                        />
                      }
                      label="Tất cả"
                    />
                  </TableCell>
                  <TableCell>Món ăn</TableCell>
                  <TableCell align="center">Số lượng</TableCell>
                  <TableCell align="right">Đơn giá</TableCell>
                  <TableCell align="right">Tổng tiền</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.cartItems.map((item) => (
                  <TableRow key={item.id} hover>
                    {/* Checkbox chọn món */}
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(item.foodItemId)}
                        onChange={() => handleSelectItem(item.foodItemId)}
                        color="primary"
                      />
                    </TableCell>
                    
                    {/* Thông tin món ăn */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <img 
                          src={item.foodItemImage} 
                          alt={item.foodItemName}
                          style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }}
                        />
                        <Typography variant="body1" fontWeight="medium">
                          {item.foodItemName}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    {/* Điều khiển số lượng */}
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleUpdateQuantity(item.foodItemId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Chip label={item.quantity} size="small" color="primary" />
                        <IconButton 
                          size="small" 
                          onClick={() => handleUpdateQuantity(item.foodItemId, item.quantity + 1)}
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                    
                    {/* Đơn giá */}
                    <TableCell align="right">
                      {(item.discountPrice > 0 ? item.discountPrice : item.price)?.toLocaleString('vi-VN')}đ
                    </TableCell>
                    
                    {/* Tổng tiền món */}
                    <TableCell align="right">
                      <Typography color="primary" fontWeight="bold">
                        {((item.discountPrice > 0 ? item.discountPrice : item.price) * item.quantity).toLocaleString('vi-VN')}đ
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Thông tin tổng quan và nút thao tác */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Tổng cộng: {cart.totalItems} món
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đã chọn: {selectedItems.length} món
              </Typography>
              {selectedItems.length > 0 && (
                <Typography variant="h6" color="primary" fontWeight="bold">
                  Tổng tiền: {getTotalPrice(getSelectedItems()).toLocaleString('vi-VN')}đ
                </Typography>
              )}
              <Typography variant="h6" color="success.main" fontWeight="bold">
                Tổng tiền giỏ hàng: {getTotalPrice(cart.cartItems).toLocaleString('vi-VN')}đ
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                disabled={selectedItems.length === 0}
                onClick={handleOrderSelected}
              >
                Xác nhận món đã chọn
              </Button>
              <Button
                variant="contained"
                color="error"
                disabled={selectedItems.length === 0}
                onClick={handleRemoveSelected}
              >
                Xóa món đã chọn
              </Button>
            </Box>
          </Box>

          {/* Dialog xác nhận đặt hàng */}
          <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
            <DialogTitle>
              {selectedItems.length > 0 ? 'Xác nhận đặt món đã chọn' : 'Xác nhận đặt tất cả đơn hàng'}
            </DialogTitle>
            <DialogContent>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Món ăn</TableCell>
                    <TableCell align="center">Số lượng</TableCell>
                    <TableCell align="right">Đơn giá</TableCell>
                    <TableCell align="right">Tổng tiền</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(selectedItems.length > 0 ? getSelectedItems() : cart.cartItems).map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.foodItemName}</TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="right">{(item.discountPrice > 0 ? item.discountPrice : item.price)?.toLocaleString('vi-VN')}đ</TableCell>
                      <TableCell align="right">{((item.discountPrice > 0 ? item.discountPrice : item.price) * item.quantity).toLocaleString('vi-VN')}đ</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  Tổng tiền: {getTotalPrice(selectedItems.length > 0 ? getSelectedItems() : cart.cartItems).toLocaleString('vi-VN')}đ
                </Typography>
              </Box>
              <TextField
                label="Ghi chú cho đơn hàng"
                fullWidth
                multiline
                minRows={2}
                sx={{ mt: 2 }}
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Nhập ghi chú nếu có..."
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenModal(false)} color="inherit">
                Hủy
              </Button>
              <Button 
                onClick={selectedItems.length > 0 ? handleConfirmOrderSelected : handleConfirmOrderAll} 
                variant="contained" 
                color="primary"
              >
                Xác nhận đặt hàng
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Container>
  );
}
