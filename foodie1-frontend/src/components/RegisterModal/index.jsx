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
    Stepper,
    Step,
    StepLabel,
    CircularProgress,
    Alert,
    Fade
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    X,
    User,
    Lock,
    Eye,
    EyeOff,
    Mail,
    Phone,
    MapPin,
    ArrowRight,
    ArrowLeft,
    UserPlus,
    Check
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Styled components from LoginModal for consistency
const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: '24px',
        overflow: 'hidden',
        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        border: '1px solid rgba(255,255,255,0.2)',
        maxWidth: '600px', // Increased width for stepper
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

const StepButton = styled(Button)({
    borderRadius: '12px',
    padding: '12px 24px',
    fontWeight: 600,
    textTransform: 'none',
    '&.next-button': {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        '&:hover': {
            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
            transform: 'translateY(-2px)',
        },
    },
    '&.back-button': {
        backgroundColor: '#f3f4f6',
        color: '#6b7280',
        '&:hover': {
            backgroundColor: '#e5e7eb',
        },
    },
    transition: 'all 0.3s ease',
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

const steps = ['Thông tin cơ bản', 'Thông tin liên hệ', 'Xác nhận'];

export default function RegisterModal({ open, onClose, onLoginClick }) {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        fullName: '',
        phoneNumber: '',
        address: ''
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateStep = (step) => {
        const errors = {};
        switch (step) {
            case 0:
                if (!formData.username.trim()) errors.username = 'Tên đăng nhập là bắt buộc';
                if (!formData.password.trim()) errors.password = 'Mật khẩu là bắt buộc';
                if (formData.password.length < 6) errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
                if (!formData.fullName.trim()) errors.fullName = 'Họ và tên là bắt buộc';
                break;
            case 1:
                if (!formData.email.trim()) errors.email = 'Email là bắt buộc';
                if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email không hợp lệ';
                if (!formData.phoneNumber.trim()) errors.phoneNumber = 'Số điện thoại là bắt buộc';
                if (!formData.address.trim()) errors.address = 'Địa chỉ là bắt buộc';
                break;
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(activeStep)) {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const handleClose = () => {
        // Reset state when closing
        setActiveStep(0);
        setFormData({
            username: '', password: '', email: '',
            fullName: '', phoneNumber: '', address: ''
        });
        setValidationErrors({});
        setError('');
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post('http://localhost:8080/api/register', formData);
            toast.success('Đăng ký thành công! Vui lòng đăng nhập.', {
                position: "top-right",
                autoClose: 3000,
            });
            handleClose();
            if(onLoginClick) onLoginClick(); // Open login modal after successful registration
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra khi đăng ký.';
            setError(errorMessage);
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Fade in>
                        <Box>
                            <StyledTextField
                                fullWidth required autoFocus
                                label="Họ và tên" name="fullName"
                                value={formData.fullName} onChange={handleChange}
                                error={!!validationErrors.fullName} helperText={validationErrors.fullName}
                                InputProps={{ startAdornment: <InputAdornment position="start"><User size={20} /></InputAdornment> }}
                            />
                            <StyledTextField
                                fullWidth required
                                label="Tên đăng nhập" name="username"
                                value={formData.username} onChange={handleChange}
                                error={!!validationErrors.username} helperText={validationErrors.username}
                                InputProps={{ startAdornment: <InputAdornment position="start"><User size={20} /></InputAdornment> }}
                            />
                            <StyledTextField
                                fullWidth required
                                label="Mật khẩu" name="password" type={showPassword ? 'text' : 'password'}
                                value={formData.password} onChange={handleChange}
                                error={!!validationErrors.password} helperText={validationErrors.password}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Lock size={20} /></InputAdornment>,
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Box>
                    </Fade>
                );
            case 1:
                return (
                    <Fade in>
                        <Box>
                            <StyledTextField
                                fullWidth required
                                label="Email" name="email" type="email"
                                value={formData.email} onChange={handleChange}
                                error={!!validationErrors.email} helperText={validationErrors.email}
                                InputProps={{ startAdornment: <InputAdornment position="start"><Mail size={20} /></InputAdornment> }}
                            />
                            <StyledTextField
                                fullWidth required
                                label="Số điện thoại" name="phoneNumber"
                                value={formData.phoneNumber} onChange={handleChange}
                                error={!!validationErrors.phoneNumber} helperText={validationErrors.phoneNumber}
                                InputProps={{ startAdornment: <InputAdornment position="start"><Phone size={20} /></InputAdornment> }}
                            />
                            <StyledTextField
                                fullWidth required
                                label="Địa chỉ" name="address"
                                value={formData.address} onChange={handleChange}
                                error={!!validationErrors.address} helperText={validationErrors.address}
                                InputProps={{ startAdornment: <InputAdornment position="start"><MapPin size={20} /></InputAdornment> }}
                            />
                        </Box>
                    </Fade>
                );
            case 2:
                return (
                    <Fade in>
                        <Box sx={{ textAlign: 'left', p: 2, backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
                            <Typography variant="h6" gutterBottom>Xác nhận thông tin</Typography>
                            <Typography><strong>Họ và tên:</strong> {formData.fullName}</Typography>
                            <Typography><strong>Tên đăng nhập:</strong> {formData.username}</Typography>
                            <Typography><strong>Email:</strong> {formData.email}</Typography>
                            <Typography><strong>Số điện thoại:</strong> {formData.phoneNumber}</Typography>
                            <Typography><strong>Địa chỉ:</strong> {formData.address}</Typography>
                        </Box>
                    </Fade>
                );
            default:
                return 'Unknown step';
        }
    };

    return (
        <StyledDialog open={open} onClose={handleClose} TransitionComponent={Fade} transitionDuration={300}>
            <DialogContent sx={{ p: 0 }}>
                <GradientHeader>
                    <CloseButton onClick={handleClose}>
                        <X size={24} />
                    </CloseButton>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Tạo tài khoản</Typography>
                    <Typography sx={{ opacity: 0.9 }}>Tham gia và khám phá ẩm thực</Typography>
                </GradientHeader>

                <Box sx={{ p: 4 }}>
                    <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <form onSubmit={handleSubmit}>
                        {renderStepContent(activeStep)}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                            <StepButton
                                className="back-button"
                                disabled={activeStep === 0 || loading}
                                onClick={handleBack}
                                startIcon={<ArrowLeft />}
                            >
                                Quay lại
                            </StepButton>
                            {activeStep === steps.length - 1 ? (
                                <StepButton
                                    className="next-button"
                                    type="submit"
                                    disabled={loading}
                                    variant="contained"
                                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Check />}
                                >
                                    {loading ? 'Đang xử lý...' : 'Hoàn tất'}
                                </StepButton>
                            ) : (
                                <StepButton
                                    className="next-button"
                                    variant="contained"
                                    onClick={handleNext}
                                    endIcon={<ArrowRight />}
                                >
                                    Tiếp theo
                                </StepButton>
                            )}
                        </Box>
                    </form>
                     <Typography align="center" sx={{ mt: 3, color: 'text.secondary' }}>
                        Đã có tài khoản?{' '}
                        <Button
                            variant="text"
                            onClick={() => {
                                handleClose();
                                onLoginClick();
                            }}
                            sx={{ textTransform: 'none', fontWeight: 600 }}
                        >
                            Đăng nhập ngay
                        </Button>
                    </Typography>
                </Box>
            </DialogContent>
        </StyledDialog>
    );
} 