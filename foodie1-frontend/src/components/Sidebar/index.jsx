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
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(10px)',
    padding: theme.spacing(2),
    color: '#fff',
    width: '60px',
    height: 'calc(100vh - 64px)',
    position: 'fixed',
    top: '64px',
    left: 0,
    zIndex: 1000,
    transition: 'all 0.3s ease',
    '&:hover': {
        width: '240px',
        '& .greeting-text': {
            opacity: 1,
            transform: 'translateX(0)',
        },
        '& .menu-text': {
            opacity: 1,
            transform: 'translateX(0)',
        }
    }
}));

const GreetingText = styled(Typography)({
    opacity: 0,
    transform: 'translateX(-20px)',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
    marginBottom: '16px',
    fontSize: '0.9rem',
    color: '#fff',
    fontWeight: 500
});

const StyledListItemButton = styled(ListItemButton)({
    borderRadius: '8px',
    padding: '10px 16px',
    margin: '4px 0',
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: 'rgba(255, 98, 0, 0.2)',
        color: '#ff6200',
    },
    '&.active': {
        backgroundColor: 'rgba(255, 98, 0, 0.3)',
        color: '#ff6200',
    }
});

const IconWrapper = styled(Box)({
    minWidth: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
});

const MenuText = styled(Typography)({
    opacity: 0,
    transform: 'translateX(-20px)',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
    marginLeft: '12px'
});

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { text: "Trang chủ", icon: <HomeIcon />, path: "/user" },
        { text: "Tài khoản", icon: <AccountCircleIcon />, path: "/user/account" },
        { text: "Giỏ hàng", icon: <ShoppingCartIcon />, path: "/user/cart" },
        { text: "Lịch sử đặt hàng", icon: <HistoryIcon />, path: "/user/history" },
        { text: "Cài đặt", icon: <SettingsIcon />, path: "/user/settings" },
        { text: "Hỗ trợ", icon: <HelpIcon />, path: "/user/help" }
    ];

    return (
        <StyledBox>
            <GreetingText className="greeting-text">
                👋 Xin chào, Khách
            </GreetingText>

            <List sx={{ p: 0 }}>
                {menuItems.map((item, index) => (
                    <ListItem key={index} disablePadding>
                        <StyledListItemButton
                            onClick={() => navigate(item.path)}
                            className={location.pathname === item.path ? 'active' : ''}
                        >
                            <IconWrapper>
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