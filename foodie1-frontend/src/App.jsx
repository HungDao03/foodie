import './App.css';
import { Route, Routes } from "react-router";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ThemeProvider, CssBaseline } from "@mui/material"; // Thêm dòng này


import Main from "./components/layout/Main/index.jsx";

import Index from "./pages/User/Account/index.jsx";
import FoodProvider from './components/store/foodStore.jsx';
import AdminList from './pages/Admin/index.jsx';
import Homepage from "./pages/home/index.jsx";
import customTheme from "./components/theme/theme.js";
import FoodCardList from "./pages/User/index.jsx";
import OrderHistory from './pages/User/history/index.jsx';


function App() {
    return (
        <ThemeProvider theme={customTheme}>
            <CssBaseline />
            <FoodProvider>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
                <Routes>
                    <Route path="" element={<Homepage />} />
                    <Route path="/user" element={<Main />} >
                        <Route path="" element={<FoodCardList />} />
                        <Route path="account" element={<Index />} />
                        <Route path="history" element={<OrderHistory />} />
                    </Route>
                    <Route path="/admin" element={<AdminList />} />
                </Routes>
            </FoodProvider>
        </ThemeProvider>
    );
}


export default App
