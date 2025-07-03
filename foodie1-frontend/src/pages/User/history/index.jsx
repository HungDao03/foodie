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
  Chip,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import OrderService from '../../../service/orderService.js';

function getStatusColor(status) {
  switch (status) {
    case 'PENDING': return 'warning';
    case 'PROCESSING': return 'info';
    case 'DELIVERING': return 'primary';
    case 'COMPLETED': return 'success';
    case 'CANCELLED': return 'error';
    default: return 'default';
  }
}
function getStatusText(status) {
  switch (status) {
    case 'PENDING': return 'Chờ xác nhận';
    case 'PROCESSING': return 'Đang xử lý';
    case 'DELIVERING': return 'Đang giao';
    case 'COMPLETED': return 'Đã hoàn thành';
    case 'CANCELLED': return 'Đã hủy';
    default: return status;
  }
}

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await OrderService.getUserOrders();
        setOrders(res.data);
      } catch (err) {
        setError('Không thể lấy lịch sử đơn hàng!');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" sx={{ width: '100%', borderRadius: 2, fontWeight: 600 }}>
          {error}
        </Alert>
      </Snackbar>
      <Typography
        variant="h4"
        sx={{ mb: 4, fontWeight: 'bold', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0 2px 8px rgba(60,40,120,0.10)' }}
      >
        Lịch sử đặt hàng
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <CircularProgress sx={{ color: '#667eea' }} />
        </Box>
      ) : orders.length === 0 ? (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Bạn chưa có đơn hàng nào
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2, background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)', borderRadius: 4, boxShadow: '0 8px 32px rgba(102,126,234,0.10)' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã đơn</TableCell>
                <TableCell>Món ăn</TableCell>
                <TableCell align="center">Số lượng</TableCell>
                <TableCell align="right">Đơn giá</TableCell>
                <TableCell align="right">Tổng tiền</TableCell>
                <TableCell>Địa chỉ</TableCell>
                <TableCell>SĐT</TableCell>
                <TableCell>Thời gian</TableCell>
                <TableCell>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>{order.foodItem?.name || 'N/A'}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={order.quantity}
                      size="small"
                      sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    {order.foodItem?.discountPrice?.toLocaleString('vi-VN') || order.foodItem?.price?.toLocaleString('vi-VN') || 0}đ
                  </TableCell>
                  <TableCell align="right">
                    <Typography color="primary" fontWeight="bold">
                      {order.totalAmount?.toLocaleString('vi-VN')}đ
                    </Typography>
                  </TableCell>
                  <TableCell>{order.deliveryAddress}</TableCell>
                  <TableCell>{order.phoneNumber}</TableCell>
                  <TableCell>{order.orderTime ? new Date(order.orderTime).toLocaleString('vi-VN') : ''}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusText(order.status)}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
