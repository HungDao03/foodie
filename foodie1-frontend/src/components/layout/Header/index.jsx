import {AppBar, Button, Toolbar, Box} from "@mui/material";

function Header() {
    return (
        <>
            {/* Header */}
            <AppBar position="sticky" sx={{ bgcolor: "white", boxShadow: 1 }}>
                <Toolbar>
                    <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
                        <img src="/logofoodie.png" alt="Foodie Logo" style={{ width: 70, height: 70, marginRight: 6 }} />
                    </Box>

                    <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3, mr: 3 }}>
                        <Button sx={{ color: "black" }}>Trang chủ</Button>
                        <Button sx={{ color: "black" }}>Liên hệ</Button>
                        <Button sx={{ color: "black" }} >Đăng nhập</Button>
                        <Button sx={{ color: "black" }} >Đăng ký</Button>
                    </Box>
                </Toolbar>
            </AppBar>
        </>
    );
}

export default Header;