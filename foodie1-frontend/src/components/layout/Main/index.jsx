import Header from "../Header/index.jsx";
import Sidebar from "../Sidebar/index.jsx";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

function Main() {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Header />
            <Sidebar />
            <Box
                className="main-content"
                sx={{
                    ml: { xs: 0, md: '240px' },
                    pt: 3, // padding top đồng nhất
                    px: { xs: 1, md: 3 },
                    minHeight: 'calc(100vh - 64px)',
                    transition: 'margin-left 0.3s',
                    boxSizing: 'border-box',
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}

export default Main;