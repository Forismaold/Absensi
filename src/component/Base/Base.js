import Absen from "./Absen/Absen"
import AdminDashboard from "./Admin/AdminDashboard"
import Akun from "./Akun/Akun"
import { Routes, Route, useLocation } from 'react-router-dom'
import Login from "./Akun/Login"
import Register from "./Akun/Register"

export default function Base() {
    const location = useLocation()
    const pathSegments = location.pathname.split('/')
    return (
        <div className="w-full flex justify-center">
            <div className="m-4 bg-neutral-100 rounded-3xl shadow-2xl h-full p-4 max-w-[1440px] self-stretch flex-1">
                <h5 className="text-3xl font-bold text-neutral-700 capitalize pt-4">{pathSegments[pathSegments.length - 1] || 'Absen'}</h5>
                <Routes>
                    <Route path={'*'} element={<Absen/>}></Route>
                    <Route path={'/admin/dashboard'} element={<AdminDashboard/>}></Route>
                    <Route path={'/akun'} element={<Akun/>}></Route>
                    <Route path={'/akun/masuk'} element={<Login/>}></Route>
                    <Route path={'/akun/daftar'} element={<Register/>}></Route>
                </Routes>
            </div>
        </div>
    )
}