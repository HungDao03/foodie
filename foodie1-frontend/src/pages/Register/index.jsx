import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TextField,
    Button,
    Container,
    Typography,
    Box,
    Paper
} from '@mui/material';
import axios from 'axios';
import Header from '../../components/Header/index.jsx';
import './Register.css'; // Nhập file CSS

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        fullName: '',
        phoneNumber: '',
        address: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/register', formData);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data));
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data || 'Có lỗi xảy ra khi đăng ký');
        }
    };

    return (
        <>
            <Header />

            <Container component="main" maxWidth="xs" className="register-container">
                <Box className="register-box">
                    <Paper className="register-paper">
                        <Typography component="h1" variant="h4" align="center" className="register-title">
                            Đăng Ký
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} className="register-form">
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Tên đăng nhập"
                                name="username"
                                autoComplete="username"
                                autoFocus
                                value={formData.username}
                                onChange={handleChange}
                                className="register-textfield"
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Mật khẩu"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                value={formData.password}
                                onChange={handleChange}
                                className="register-textfield"
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                autoComplete="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="register-textfield"
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="fullName"
                                label="Họ và tên"
                                name="fullName"
                                autoComplete="name"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="register-textfield"
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="phoneNumber"
                                label="Số điện thoại"
                                name="phoneNumber"
                                autoComplete="tel"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="register-textfield"
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="address"
                                label="Địa chỉ"
                                name="address"
                                autoComplete="street-address"
                                value={formData.address}
                                onChange={handleChange}
                                className="register-textfield"
                            />
                            {error && (
                                <Typography color="error" variant="body2" className="register-error">
                                    {error}
                                </Typography>
                            )}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                className="register-submit-button"
                            >
                                Đăng Ký
                            </Button>
                            <Button
                                fullWidth
                                variant="text"
                                onClick={() => navigate('/login')}
                                className="register-login-link"
                            >
                                Đã có tài khoản? Đăng nhập ngay
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </>
    );
}

export default Register;