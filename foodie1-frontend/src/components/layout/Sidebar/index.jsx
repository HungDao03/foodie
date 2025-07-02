import {
    Box,
    Typography,
    Stack,
    List,
    ListItem,
    ListItemButton,
    ListItemText
} from "@mui/material";
import { styled } from "@mui/material/styles";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate, useLocation } from "react-router-dom";

const StyledBox = styled(Box)(({ theme }) => ({
    background: theme.palette.background.paper,
    backdropFilter: 'blur(10px)',
    padding: theme.spacing(2),
    color: theme.palette.text.primary,
    width: '240px',
    height: 'calc(100vh - 64px)',
    position: 'fixed',
    top: '64px',
    left: 0,
    zIndex: 1000,
    transition: 'all 0.3s ease',
    borderRight: '1px solid #e0e0e0',
}));

const GreetingText = styled(Typography)(({ theme }) => ({
    opacity: 1,
    transform: 'translateX(0)',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
    marginBottom: '16px',
    fontSize: '0.9rem',
    color: theme.palette.text.primary,
    fontWeight: 500
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
    borderRadius: '18px',
    padding: '12px 20px',
    margin: '6px 0',
    fontWeight: 700,
    fontSize: '1rem',
    transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
    justifyContent: 'flex-start',
    '&:hover': {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        boxShadow: theme.shadows[2],
    },
    '&.active': {
        background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
        color: '#fff',
        boxShadow: theme.shadows[4],
    }
}));

const IconWrapper = styled(Box)({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});

const MenuText = styled(Typography)(({ theme }) => ({
    opacity: 1,
    transform: 'translateX(0)',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
    marginLeft: '12px',
    color: theme.palette.text.primary
}));

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { text: "Trang chủ", icon: <HomeIcon fontSize="inherit" />, path: "/user" },
        { text: "Tài khoản", icon: <AccountCircleIcon fontSize="inherit" />, path: "/user/account" },
        { text: "Giỏ hàng", icon: <ShoppingCartIcon fontSize="inherit" />, path: "/user/cart" },
        { text: "Lịch sử đặt hàng", icon: <HistoryIcon fontSize="inherit" />, path: "/user/history" },
        { text: "Cài đặt", icon: <SettingsIcon fontSize="inherit" />, path: "/user/settings" },
        { text: "Hỗ trợ", icon: <HelpIcon fontSize="inherit" />, path: "/user/help" }
    ];

    return (
        <StyledBox>
            <GreetingText className="greeting-text">
                👋 Xin chào, Khách
            </GreetingText>
            <List sx={{ p: 0 }}>
                {menuItems.map((item, index) => (
                    <ListItem key={index} disablePadding sx={{ display: 'flex', justifyContent: 'center' }}>
                        <StyledListItemButton
                            onClick={() => navigate(item.path)}
                            className={location.pathname === item.path ? 'active' : ''}
                        >
                            <IconWrapper sx={{ fontSize: 24, height: 44 }}>
                                {item.icon}
                            </IconWrapper>
                            <MenuText className="menu-text">
                                {item.text}
                            </MenuText>
                        </StyledListItemButton>
                    </ListItem>
                ))}
            </List>
        </StyledBox>
    );
}

export default Sidebar;