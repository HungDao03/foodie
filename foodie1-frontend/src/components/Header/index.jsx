import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Link,
    Box,
    useMediaQuery,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Menu,
    MenuItem,
    TextField,
    InputAdornment,
    CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import './Header.css';

function Header() {
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width:960px)');
    const [isLoading, setIsLoading] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [foodAnchorEl, setFoodAnchorEl] = useState(null);
    const [locationAnchorEl, setLocationAnchorEl] = useState(null);
    const [drinkAnchorEl, setDrinkAnchorEl] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Xử lý đăng xuất
    const handleLogout = async () => {
        setIsLoading(true);
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            await new Promise((resolve) => setTimeout(resolve, 1000));
            navigate('/login');
        } catch (error) {
            console.error('Lỗi khi đăng xuất:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Xử lý tìm kiếm
    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    // Xử lý mở/đóng drawer trên mobile
    const handleDrawerToggle = () => {
        setMobileOpen((prev) => !prev);
    };

    // Xử lý menu Đồ ăn
    const handleFoodMenuOpen = (event) => {
        setFoodAnchorEl(event.currentTarget);
    };

    const handleFoodMenuClose = () => {
        setFoodAnchorEl(null);
    };

    // Xử lý menu Địa điểm
    const handleLocationMenuOpen = (event) => {
        setLocationAnchorEl(event.currentTarget);
    };

    const handleLocationMenuClose = () => {
        setLocationAnchorEl(null);
    };

    // Xử lý menu Rượu bia
    const handleDrinkMenuOpen = (event) => {
        setDrinkAnchorEl(event.currentTarget);
    };

    const handleDrinkMenuClose = () => {
        setDrinkAnchorEl(null);
    };

    // Component Drawer cho mobile
    const drawer = (
        <List sx={{ padding: '16px' }}>
            {[
                { text: 'Hà Nội', onClick: handleLocationMenuOpen },
                { text: 'Đồ ăn', onClick: handleFoodMenuOpen },
                { text: 'Rượu bia', onClick: handleDrinkMenuOpen },
            ].map((item, index) => (
                <ListItem
                    key={index}
                    button
                    onClick={item.onClick}
                    sx={{ borderRadius: '8px', marginBottom: '8px' }}
                >
                    <ListItemText primary={item.text} />
                </ListItem>
            ))}
        </List>
    );

    return (
        <>
            <div className="app-background" />
            <AppBar position="fixed" className="header-appbar">
                <Toolbar className="header-toolbar">
                    {/* Nút Menu cho mobile */}
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            aria-label="Mở menu điều hướng"
                            edge="start"
                            onClick={handleDrawerToggle}
                            className="header-menu-button"
                        >
                            <MenuIcon />
                        </IconButton>
                    )}

                    {/* Logo */}
                    <Box className="header-logo-box" onClick={() => navigate('/')}>
                        <img src="/crazy-food-logo.svg" alt="Crazy Food" className="header-logo" />
                        {!isMobile && (
                            <Typography variant="h5" className="header-logo-text">
                                Foodie
                            </Typography>
                        )}
                    </Box>

                    {/* Nhóm nút điều hướng cho desktop */}
                    {!isMobile && (
                        <Box className="header-button-group">
                            {[
                                { text: 'Hà Nội', onClick: handleLocationMenuOpen },
                                { text: 'Đồ ăn', onClick: handleFoodMenuOpen },
                                { text: 'Đồ uống', onClick: handleDrinkMenuOpen },
                            ].map((item, index) => (
                                <Button
                                    key={index}
                                    color="inherit"
                                    onClick={item.onClick}
                                    className="header-nav-button"
                                >
                                    {item.text}
                                </Button>
                            ))}
                        </Box>
                    )}

                    {/* Thanh tìm kiếm */}
                    <Box className="header-search-box">
                        <TextField
                            placeholder="Tìm kiếm món ăn, nhà hàng..."
                            variant="outlined"
                            size="small"
                            value={searchQuery}
                            onChange={handleSearch}
                            className={`header-search-input ${isLoading ? 'header-search-loading' : ''}`}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon className="header-search-icon" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    {/* Nhóm nút chức năng */}
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
                </Toolbar>

                {/* Menu dropdown cho Địa điểm */}
                <Menu
                    anchorEl={locationAnchorEl}
                    open={Boolean(locationAnchorEl)}
                    onClose={handleLocationMenuClose}
                    className="header-menu"
                >
                    {['Hoàn Kiếm', 'Ba Đình', 'Đống Đa', 'Hai Bà Trưng', 'Cầu Giấy'].map((item, index) => (
                        <MenuItem key={index} onClick={handleLocationMenuClose}>
                            {item}
                        </MenuItem>
                    ))}
                </Menu>

                {/* Menu dropdown cho Đồ ăn */}
                <Menu
                    anchorEl={foodAnchorEl}
                    open={Boolean(foodAnchorEl)}
                    onClose={handleFoodMenuClose}
                    className="header-menu"
                >
                    {['Món Việt', 'Món Á', 'Món Âu', 'Đồ ăn nhanh'].map((item, index) => (
                        <MenuItem key={index} onClick={handleFoodMenuClose}>
                            {item}
                        </MenuItem>
                    ))}
                </Menu>

                {/* Menu dropdown cho Rượu bia */}
                <Menu
                    anchorEl={drinkAnchorEl}
                    open={Boolean(drinkAnchorEl)}
                    onClose={handleDrinkMenuClose}
                    className="header-menu"
                >
                    {['Bia', 'Rượu vang', 'Cocktail', 'Đồ uống không cồn'].map((item, index) => (
                        <MenuItem key={index} onClick={handleDrinkMenuClose}>
                            {item}
                        </MenuItem>
                    ))}
                </Menu>
            </AppBar>

            {/* Drawer cho mobile */}
            <Drawer
                variant="temporary"
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                className="header-drawer"
                ModalProps={{ keepMounted: true }}
            >
                {drawer}
            </Drawer>
        </>
    );
}

export default Header;