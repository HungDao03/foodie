import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    CircularProgress
} from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function OrderList() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user?.token) {
                toast.error('Vui lòng đăng nhập để xem đơn hàng!');
                return;
            }

            const response = await axios.get(`http://localhost:8080/api/orders/${user.id}`, {
                headers: {
                    'Authorization': `${user.tokenType} ${user.token}`
                }
            });
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Không thể lấy danh sách đơn hàng!');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'warning';
            case 'PROCESSING':
                return 'info';
            case 'DELIVERING':
                return 'primary';
            case 'COMPLETED':
                return 'success';
            case 'CANCELLED':
                return 'error';
            default:
                return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'PENDING':
                return 'Chờ xác nhận';
            case 'PROCESSING':
                return 'Đang xử lý';
            case 'DELIVERING':
                return 'Đang giao';
            case 'COMPLETED':
                return 'Đã hoàn thành';
            case 'CANCELLED':
                return 'Đã hủy';
            default:
                return status;
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (orders.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', my: 4 }}>
                <Typography variant="h6" color="text.secondary">
                    Bạn chưa có đơn hàng nào
                </Typography>
            </Box>
        );
    }

    return (
        <TableContainer component={Paper} sx={{ mt: 2, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
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
                            <TableCell>{order.foodItem.name}</TableCell>
                            <TableCell align="center">
                                <Chip
                                    label={order.quantity}
                                    size="small"
                                    sx={{
                                        fontWeight: 'bold',
                                        bgcolor: 'primary.main',
                                        color: 'white'
                                    }}
                                />
                            </TableCell>
                            <TableCell align="right">
                                {order.foodItem.discountPrice?.toLocaleString('vi-VN')}đ
                            </TableCell>
                            <TableCell align="right">
                                <Typography color="primary" fontWeight="bold">
                                    {order.totalAmount?.toLocaleString('vi-VN')}đ
                                </Typography>
                            </TableCell>
                            <TableCell>{order.deliveryAddress}</TableCell>
                            <TableCell>{order.phoneNumber}</TableCell>
                            <TableCell>
                                {new Date(order.orderTime).toLocaleString('vi-VN')}
                            </TableCell>
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
    );
}

export default OrderList;