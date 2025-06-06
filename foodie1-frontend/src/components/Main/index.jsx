import Header from "../Header/index.jsx";
import Sidebar from "../Sidebar/index.jsx";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import "./main.css";

function Main() {
    return (
        <Box sx={{ minHeight: '100vh', position: 'relative' }}>
            <div className="app-background" />
            <Header />
            <Box className="main-content-wrapper">
                <Sidebar />
                <Box className="main-content">
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}

export default Main;