import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Avatar,
    Button,
    Stack,
    TextField,
    Tabs,
    Tab,
    Divider,
    Alert,
    Snackbar,
    CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Account() {
    const [value, setValue] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [userData, setUserData] = useState({
        full_name: '',
        email: '',
        phone_number: '',
        address: '',
        avatar: '',
        username: '',
    });
    const navigate = useNavigate();
    const API_URL = 'http://localhost:8080';

    const fetchUserData = useCallback(async () => {
        try {
            setIsLoading(true);
            const userStorage = localStorage.getItem('user');
            console.log('User from localStorage:', userStorage);
            
            const user = JSON.parse(userStorage);
            console.log('Parsed user data:', user);
            
            if (!user?.token) {
                console.log('No token found in user data');
                navigate('/login');
                return;
            }

            console.log('Making API call to:', `http://localhost:8080/api/users/profile`);
            const response = await axios.get(`http://localhost:8080/api/users/profile`, {
                headers: {
                    'Authorization': `${user.tokenType} ${user.token}`,
                    'Content-Type': 'application/json'
                },
            });

            console.log('Full API Response:', response);
            const data = response.data;
            console.log('User data from API:', data);

            if (data) {
                const updatedUserData = {
                    full_name: data.fullName || '',
                    email: data.email || '',
                    phone_number: data.phoneNumber || '',
                    address: data.address || '',
                    avatar: data.avatar || '',
                    username: data.username || ''
                };
                console.log('Setting user data to:', updatedUserData);
                setUserData(updatedUserData);
                setError(null);
            } else {
                console.log('No data received from API');
                setError('Không nhận được dữ liệu từ server');
            }
        } catch (err) {
            console.error('Detailed error:', {
                error: err,
                response: err.response,
                status: err.response?.status,
                data: err.response?.data
            });
            if (err.response?.status === 401) {
                navigate('/login');
            } else {
                setError('Không thể tải thông tin người dùng. Vui lòng thử lại sau.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            setIsLoading(true);
            const user = JSON.parse(localStorage.getItem('user'));
            
            // Chuyển đổi format dữ liệu để khớp với backend
            const dataToSend = {
                fullName: userData.full_name,
                email: userData.email,
                phoneNumber: userData.phone_number,
                address: userData.address,
                username: userData.username
            };

            const response = await axios.put('http://localhost:8080/api/users/profile', dataToSend, {
                headers: {
                    'Authorization': `${user.tokenType} ${user.token}`,
                    'Content-Type': 'application/json'
                },
            });

            const updatedUser = response.data;
            // Cập nhật state với dữ liệu mới từ server
            setUserData({
                full_name: updatedUser.fullName || '',
                email: updatedUser.email || '',
                phone_number: updatedUser.phoneNumber || '',
                address: updatedUser.address || '',
                avatar: updatedUser.avatar || '',
                username: updatedUser.username || ''
            });
            
            setIsEditing(false);
            setSuccessMessage('Cập nhật thông tin thành công!');
            setError(null);
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Không thể cập nhật thông tin. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value,
        });
    };

    const getAvatarUrl = (avatarPath) => {
        if (!avatarPath) return 'https://via.placeholder.com/150';
        if (avatarPath.startsWith('http')) return avatarPath;
        return `${API_URL}${avatarPath}`;
    };

    const handleAvatarChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Kiểm tra kích thước file (giới hạn 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Kích thước file không được vượt quá 5MB');
            return;
        }

        // Kiểm tra loại file
        if (!file.type.startsWith('image/')) {
            setError('Chỉ chấp nhận file ảnh');
            return;
        }

        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append('file', file);

            const user = JSON.parse(localStorage.getItem('user'));
            console.log('Uploading avatar with token:', user.token);

            const response = await axios.post(`${API_URL}/api/users/avatar`, 
                formData,
                {
                    headers: {
                        'Authorization': `${user.tokenType} ${user.token}`,
                        'Content-Type': 'multipart/form-data'
                    },
                }
            );

            console.log('Upload response:', response.data);

            // Cập nhật avatar URL trong state và localStorage
            const avatarUrl = response.data;
            console.log('New avatar URL:', avatarUrl);
            
            // Cập nhật state
            setUserData(prev => {
                console.log('Updating userData with new avatar:', avatarUrl);
                return {
                    ...prev,
                    avatar: avatarUrl
                };
            });

            // Cập nhật thông tin user trong localStorage
            const updatedUser = {
                ...user,
                avatar: avatarUrl
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            console.log('Updated localStorage with new avatar');

            // Gọi API để lấy thông tin user mới nhất
            await fetchUserData();

            setSuccessMessage('Cập nhật ảnh đại diện thành công!');
            setError(null);
        } catch (err) {
            console.error('Error uploading avatar:', err);
            if (err.response) {
                console.error('Error response:', err.response.data);
            }
            setError('Không thể cập nhật ảnh đại diện. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !userData.full_name) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    bgcolor: '#121212',
                }}
            >
                <CircularProgress sx={{ color: 'white' }} />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Snackbar
                open={!!error || !!successMessage}
                autoHideDuration={6000}
                onClose={() => {
                    setError(null);
                    setSuccessMessage('');
                }}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity={error ? 'error' : 'success'} sx={{ width: '100%' }}>
                    {error || successMessage}
                </Alert>
            </Snackbar>

            <Typography variant="h4" sx={{ mb: 4, color: 'white', fontWeight: 'bold' }}>
                Tài khoản của tôi
            </Typography>

            <Paper
                sx={{
                    p: 3,
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 2,
                    color: 'white',
                }}
            >
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="flex-start">
                    {/* Profile Image Section */}
                    <Box sx={{ textAlign: 'center', minWidth: { md: 200 } }}>
                        <Avatar
                            src={getAvatarUrl(userData.avatar)}
                            sx={{
                                width: 150,
                                height: 150,
                                mx: 'auto',
                                mb: 2,
                                border: '4px solid rgba(255, 98, 0, 0.5)',
                            }}
                            imgProps={{
                                onError: (e) => {
                                    console.error('Avatar load error:', e);
                                    console.log('Failed URL:', e.target.src);
                                    console.log('Current userData:', userData);
                                    e.target.src = 'https://via.placeholder.com/150';
                                }
                            }}
                        />
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="avatar-upload"
                            type="file"
                            onChange={handleAvatarChange}
                            disabled={isLoading}
                        />
                        <label htmlFor="avatar-upload">
                            <Button
                                component="span"
                                variant="outlined"
                                disabled={isLoading}
                                sx={{
                                    color: 'white',
                                    borderColor: 'rgba(255, 255, 255, 0.5)',
                                    '&:hover': {
                                        borderColor: 'white',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    },
                                }}
                            >
                                {isLoading ? <CircularProgress size={24} /> : 'Thay đổi ảnh'}
                            </Button>
                        </label>
                    </Box>

                    {/* Profile Info Section */}
                    <Box sx={{ flex: 1 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                Thông tin cá nhân
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                                onClick={isEditing ? handleSave : handleEdit}
                                disabled={isLoading}
                                sx={{
                                    bgcolor: '#ff6200',
                                    '&:hover': { bgcolor: '#ff8c00' },
                                }}
                            >
                                {isLoading ? <CircularProgress size={24} color="inherit" /> : isEditing ? 'Lưu' : 'Chỉnh sửa'}
                            </Button>
                        </Stack>

                        <Stack spacing={3}>
                            {['full_name', 'email', 'phone_number', 'address'].map((field) => (
                                <TextField
                                    key={field}
                                    label={
                                        field === 'full_name'
                                            ? 'Họ và tên'
                                            : field === 'phone_number'
                                                ? 'Số điện thoại'
                                                : field === 'address'
                                                    ? 'Địa chỉ'
                                                    : 'Email'
                                    }
                                    name={field}
                                    value={userData[field]}
                                    onChange={handleChange}
                                    disabled={!isEditing || isLoading}
                                    fullWidth
                                    multiline={field === 'address'}
                                    rows={field === 'address' ? 2 : 1}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            color: 'white',
                                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                        },
                                        '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                                    }}
                                />
                            ))}
                        </Stack>
                    </Box>
                </Stack>

                <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

                <Tabs
                    value={value}
                    onChange={handleTabChange}
                    textColor="inherit"
                    indicatorColor="secondary"
                    aria-label="account tabs"
                    sx={{
                        '& .MuiTab-root': {
                            color: 'rgba(255,255,255,0.7)',
                        },
                        '& .Mui-selected': {
                            color: 'white',
                        },
                    }}
                >
                    <Tab label="Bài viết" />
                    <Tab label="Bình luận" />
                    <Tab label="Lịch sử mua hàng" />
                </Tabs>

                <Box sx={{ mt: 3 }}>
                    {value === 0 && <Typography>Bài viết của bạn sẽ được hiển thị tại đây.</Typography>}
                    {value === 1 && <Typography>Bình luận của bạn sẽ được hiển thị tại đây.</Typography>}
                    {value === 2 && <Typography>Lịch sử mua hàng của bạn sẽ được hiển thị tại đây.</Typography>}
                </Box>
            </Paper>
        </Container>
    );
}

export default Account;
