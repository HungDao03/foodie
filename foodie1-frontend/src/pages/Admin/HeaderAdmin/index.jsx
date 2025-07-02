import React from 'react';
import {Button, Avatar, CircularProgress, Box} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import useLogout from "../../../components/Logout/useLogout.js";

const HeaderAdmin = ({ user, onToggleSidebar }) => {
    const { handleLogout, isLoading } = useLogout();

    // Lấy chữ cái đầu của tên người dùng cho avatar
    const getInitials = (name) => {
        if (!name) return 'A';
        return name.split(' ').map(word => word[0]).join('').toUpperCase();
    };

    return (
        <header className="admin-header">
            <div className="admin-header-left">
                <div className="admin-menu-button" onClick={onToggleSidebar}>
                    <MenuIcon />
                </div>
                <div className="admin-logo">
                    <RestaurantMenuIcon /> Foodie Admin
                </div>
            </div>
            <div className="admin-header-right">
                <div className="admin-user-info">
                    <Avatar
                        src={user?.avatar}
                        alt={user?.fullName || 'Admin'}
                        sx={{
                            width: 40,
                            height: 40,
                            bgcolor: '#ff6200',
                            fontSize: '1.2rem',
                            fontWeight: 600
                        }}
                    >
                        {user?.avatar ? null : getInitials(user?.fullName)}
                    </Avatar>
                    <div className="admin-user-details">
                        <div className="admin-user-name">{user?.fullName || 'Admin'}</div>
                        <div className="admin-user-role">Quản trị viên</div>
                    </div>
                </div>
                <Box className="header-button-group">
                    <Button
                        variant="contained"
                        className="header-login-button"
                        onClick={handleLogout}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Đăng xuất'}
                    </Button>
                </Box>
            </div>
        </header>
    );
};

export default HeaderAdmin; 