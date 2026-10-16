import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
import Navbar from "./components/navbar";
import Home from "./pages/home";
import DashBoard from "./pages/dashboard";
import Contact from "./pages/contact";
import "./index.css";
import Admin from "./pages/admin";
import AdminProtected from "./components/adminProtected";
import UserProtected from "./components/userProtected";
import AddTransaction from "./components/AddTransaction";
import ForgotPassword from "./pages/forgetPassword";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />

          {/* protection to admin */}
          <Route element={<AdminProtected />}>
            <Route path="/admin" element={<Admin />} />
          </Route>

          {/* protection to user */}
          <Route element={<UserProtected />}>
            <Route path="/dashboard" element={<DashBoard />} />
            <Route path="/add-transaction" element={<AddTransaction />} />
          </Route>
        </Routes>
      </BrowserRouter>

      {/* Theme change */}
      <ThemeToggle />
    </div>
  );
}

export default App;
