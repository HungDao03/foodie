import './App.css'
import Login from "./pages/Login/index.jsx";
import Register from "./pages/Register/index.jsx";
import {Route, Routes} from "react-router";
import Main from "./components/Main/index.jsx";
import FoodCardList from "./pages/User/FoodCardList.jsx";
import Account from "./pages/User/Account.jsx";

function App() {


  return (
    <>
        <Routes>
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/user" element={<Main/>} >
                <Route path="" element={<FoodCardList/>} />
                <Route path="account" element={<Account/>} />
            </Route>
        </Routes>
    </>
  )
}

export default App
