import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Dialog,
    DialogContent,
    TextField,
    Button,
    Typography,
    Box,
    InputAdornment,
    IconButton,
    Fade,
    CircularProgress,
    Alert,
    Avatar,
    Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { X, User, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Styled components
const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: '24px',
        overflow: 'hidden',
        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        border: '1px solid rgba(255,255,255,0.2)',
        maxWidth: '480px',
        width: '100%',
        margin: '16px',
    }
}));

const GradientHeader = styled(Box)({
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '48px 32px',
    position: 'relative',
    textAlign: 'center',
});

const StyledTextField = styled(TextField)(({ theme }) => ({
    marginBottom: '24px',
    '& .MuiOutlinedInput-root': {
        borderRadius: '16px',
        backgroundColor: '#f8f9fa',
        border: 'none',
        '& fieldset': {
            border: '2px solid transparent',
        },
        '&:hover fieldset': {
            borderColor: 'rgba(102, 126, 234, 0.3)',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#667eea',
        },
    },
    '& .MuiInputLabel-root': {
        color: '#6b7280',
        '&.Mui-focused': {
            color: '#667eea',
        },
    },
}));

const GradientButton = styled(Button)({
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '16px',
    padding: '16px 32px',
    fontSize: '16px',
    fontWeight: 600,
    textTransform: 'none',
    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
    '&:hover': {
        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
        boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
        transform: 'translateY(-2px)',
    },
    '&:active': {
        transform: 'translateY(0px)',
    },
    '&.Mui-disabled': {
        background: 'linear-gradient(135deg, #ccc 0%, #999 100%)',
        color: 'white',
    },
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
});

const CloseButton = styled(IconButton)({
    position: 'absolute',
    right: '16px',
    top: '16px',
    color: 'white',
    backgroundColor: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    '&:hover': {
        backgroundColor: 'rgba(255,255,255,0.2)',
        transform: 'scale(1.1)',
    },
    transition: 'all 0.2s ease',
});

const IconAvatar = styled(Avatar)({
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)',
    margin: '0 auto 24px',
    border: '2px solid rgba(255,255,255,0.3)',
});

export default function LoginModal({ open, onClose, onRegisterClick }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8080/api/login', formData);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data));

                // Kiểm tra role từ authorities
                const isAdmin = response.data.authorities.some(
                    auth => auth.authority === 'ROLE_ADMIN'
                );

                toast.success('Đăng nhập thành công!', {
                    position: "top-right",
                    autoClose: 3000,
                });

                // Reset form and close modal
                setFormData({ username: '', password: '' });
                setError('');
                if (onClose) onClose();

                // Điều hướng dựa vào role
                if (isAdmin) {
                    navigate('/admin');
                } else {
                    navigate('/user');
                }
            }
        } catch (err) {
            setError('Tên đăng nhập hoặc mật khẩu không đúng');
            toast.error('Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin.', {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterClick = () => {
        if (onClose) onClose();
        if (onRegisterClick) onRegisterClick();
    };

    return (
        <StyledDialog
            open={open}
            onClose={onClose}
            TransitionComponent={Fade}
            transitionDuration={300}
            maxWidth={false}
        >
            <DialogContent sx={{ p: 0 }}>
                {/* Header with gradient background */}
                <GradientHeader>
                    <CloseButton onClick={onClose}>
                        <X size={24} />
                    </CloseButton>

                    <IconAvatar>
                        <LogIn size={40} />
                    </IconAvatar>

                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 700,
                            mb: 2,
                            background: 'linear-gradient(45deg, #ffffff 30%, #f0f0f0 90%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        Chào mừng trở lại
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            opacity: 0.9,
                            fontWeight: 400,
                            letterSpacing: '0.5px'
                        }}
                    >
                        Đăng nhập để tiếp tục hành trình
                    </Typography>
                </GradientHeader>

                {/* Form content */}
                <Box sx={{ p: 4 }}>
                    <Box component="form" onSubmit={handleSubmit}>
                        <StyledTextField
                            fullWidth
                            required
                            label="Tên đăng nhập"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            autoFocus
                            autoComplete="username"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <User size={20} style={{ color: '#667eea' }} />
                                    </InputAdornment>
                                ),
                            }}
                            placeholder="Nhập tên đăng nhập của bạn"
                        />

                        <StyledTextField
                            fullWidth
                            required
                            label="Mật khẩu"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock size={20} style={{ color: '#667eea' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                            sx={{
                                                color: '#667eea',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                                }
                                            }}
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            placeholder="Nhập mật khẩu của bạn"
                        />

                        {error && (
                            <Alert
                                severity="error"
                                sx={{
                                    mb: 3,
                                    borderRadius: '12px',
                                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                    border: '1px solid rgba(244, 67, 54, 0.2)',
                                    '& .MuiAlert-message': {
                                        width: '100%',
                                        textAlign: 'center'
                                    }
                                }}
                            >
                                {error}
                            </Alert>
                        )}

                        <GradientButton
                            type="submit"
                            fullWidth
                            disabled={loading}
                            sx={{ mb: 3 }}
                        >
                            {loading ? (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CircularProgress size={24} sx={{ color: 'white', mr: 2 }} />
                                    Đang đăng nhập...
                                </Box>
                            ) : (
                                'Đăng Nhập'
                            )}
                        </GradientButton>

                        <Divider sx={{ my: 3, opacity: 0.5 }} />

                        <Box sx={{ textAlign: 'center' }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: '#6b7280',
                                    mb: 2,
                                    fontSize: '15px'
                                }}
                            >
                                Chưa có tài khoản?

                                <Button
                                    onClick={handleRegisterClick}
                                    variant="text"
                                    sx={{
                                        color: '#667eea',
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        fontSize: '16px',
                                        padding: '12px 24px',
                                        borderRadius: '12px',
                                        '&:hover': {
                                            backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                            transform: 'translateY(-1px)',
                                        },
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    Đăng ký
                                </Button>
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
        </StyledDialog>
    );
}