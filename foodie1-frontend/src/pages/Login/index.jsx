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
import Header from "../../components/Header/index.jsx";
import './Login.css'; // Nhập file CSS

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
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
            const response = await axios.post('http://localhost:8080/api/login', formData);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data));
                navigate('/');
            }
        } catch (err) {
            setError('Tên đăng nhập hoặc mật khẩu không đúng');
        }
    };

    return (
        <>
            <Header />

            <Container component="main" maxWidth="xs" className="login-container">
                <Box className="login-box">
                    <Paper className="login-paper">
                        <Typography component="h1" variant="h4" align="center" className="login-title">
                            Đăng Nhập
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} className="login-form">
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
                                className="login-textfield"
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Mật khẩu"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={formData.password}
                                onChange={handleChange}
                                className="login-textfield"
                            />
                            {error && (
                                <Typography color="error" variant="body2" className="login-error">
                                    {error}
                                </Typography>
                            )}

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                onClick={() => navigate('/user')}
                                className="login-submit-button"
                            >
                                Đăng Nhập
                            </Button>
                            <Button
                                fullWidth
                                variant="text"
                                onClick={() => navigate('/register')}
                                className="login-register-link"
                            >
                                Chưa có tài khoản? Đăng ký ngay
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </>
    );
}

export default Login;