import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Avatar,
    Button,
    Stack,
    TextField,

    Alert,
    Snackbar,
    CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate } from 'react-router-dom';
import UserService from '../../service/userService';


function Account() {
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

    useEffect(() => {
        const fetchUser = async () => {
            const userStorage = localStorage.getItem('user');
            const user = userStorage ? JSON.parse(userStorage) : null;
            if (!user?.token) {
                navigate('/login');
                return;
            }
            try {
                setIsLoading(true);
                const response = await UserService.getUserProfile();
                const data = response.data;
                setUserData({
                    full_name: data.fullName || '',
                    email: data.email || '',
                    phone_number: data.phoneNumber || '',
                    address: data.address || '',
                    avatar: data.avatar || '',
                    username: data.username || ''
                });
                setError(null);
                setIsLoading(false);
            } catch (err) {
                setError('Không thể tải thông tin người dùng. Vui lòng thử lại sau.');
                setIsLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleEdit = () => setIsEditing(true);



    const handleSave = async () => {
        try {
            setIsLoading(true);
            const dataToSend = {
                fullName: userData.full_name,
                email: userData.email,
                phoneNumber: userData.phone_number,
                address: userData.address,
                username: userData.username
            };
            const response = await UserService.updateUserProfile(dataToSend);
            const updatedUser = response.data;
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

    // Hàm lấy link ảnh đại diện: loại bỏ mọi prefix thừa, chỉ ghép đúng 1 lần /uploads/avatar/
    const getAvatarUrl = (avatarPath) => {
        if (!avatarPath) return 'https://placehold.co/150/png?text=Avatar';
        if (avatarPath.startsWith('http')) return avatarPath;
        // Loại bỏ mọi prefix /uploads/ hoặc avatar/ nếu có
        let cleanPath = avatarPath.replace(/^\/uploads\//, '').replace(/^avatar\//, '');
        return `http://localhost:8080/uploads/avatar/${cleanPath}`;
    };

    //  thay đổi ảnh đại diện
    const handleAvatarChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024)
            return setError('Kích thước file không được vượt quá 5MB');

        if (!file.type.startsWith('image/'))
            return setError('Chỉ chấp nhận file ảnh');

        try {
            setIsLoading(true);

            const { data: avatarUrl } = await UserService.uploadAvatar(file);

            setUserData(prev => ({ ...prev, avatar: avatarUrl }));

            const user = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({ ...user, avatar: avatarUrl }));

            setSuccessMessage('Cập nhật ảnh đại diện thành công!');
            setError(null);
        } catch {
            setError('Không thể cập nhật ảnh đại diện. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !userData.full_name) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'background.default' }}>
                <CircularProgress sx={{ color: '#667eea' }} />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Snackbar
                open={!!error || !!successMessage}
                autoHideDuration={6000}
                onClose={() => { setError(null); setSuccessMessage(''); }}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity={error ? 'error' : 'success'} sx={{ width: '100%', borderRadius: 2, fontWeight: 600 }}>
                    {error || successMessage}
                </Alert>
            </Snackbar>

            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0 2px 8px rgba(60,40,120,0.10)' }}>
                Tài khoản của tôi
            </Typography>

            <Paper
                sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                    border: '1px solid rgba(102,126,234,0.10)',
                    borderRadius: 4,
                    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.10)',
                    color: 'text.primary',
                }}
            >
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="flex-start">
                    {/* Avatar section */}
                    <Box sx={{ textAlign: 'center', minWidth: { md: 200 } }}>
                        <Avatar
                            src={getAvatarUrl(userData.avatar)}
                            sx={{
                                width: 150,
                                height: 150,
                                mx: 'auto',
                                mb: 2,
                                border: '4px solid',
                                borderImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%) 1',
                                boxShadow: '0 4px 16px rgba(102,126,234,0.15)',
                                transition: 'box-shadow 0.3s',
                                '&:hover': { boxShadow: '0 8px 32px rgba(102,126,234,0.25)' }
                            }}
                            imgProps={{
                                onError: (e) => { e.target.src = 'https://placehold.co/150/png?text=Avatar'; }
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
                                    color: '#667eea',
                                    borderColor: '#667eea',
                                    fontWeight: 600,
                                    borderRadius: 3,
                                    px: 3,
                                    py: 1,
                                    '&:hover': {
                                        borderColor: '#764ba2',
                                        background: 'rgba(102,126,234,0.08)',
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
                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#667eea' }}>
                                Thông tin cá nhân
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                                onClick={isEditing ? handleSave : handleEdit}
                                disabled={isLoading}
                                sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    fontWeight: 700,
                                    borderRadius: 3,
                                    px: 4,
                                    py: 1.2,
                                    boxShadow: '0 4px 16px rgba(102,126,234,0.15)',
                                    '&:hover': { background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)' },
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
                                            borderRadius: 3,
                                            background: '#f8f9fa',
                                            fontWeight: 500,
                                            color: '#333',
                                            '& fieldset': { borderColor: 'rgba(102,126,234,0.15)' },
                                            '&:hover fieldset': { borderColor: '#667eea' },
                                            '&.Mui-focused fieldset': { borderColor: '#667eea' },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: '#667eea',
                                            '&.Mui-focused': { color: '#764ba2' },
                                        },
                                    }}
                                />
                            ))}
                        </Stack>
                    </Box>
                </Stack>
            </Paper>
        </Container>
    );
}

export default Account;
