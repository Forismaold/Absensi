import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import Absen from "./Absen/Absen"
import AdminDashboard from "./Admin/AdminDashboard"
import Akun from "./Akun/Akun"
import { Routes, Route, useLocation, Link } from 'react-router-dom'
import Login from "./Akun/Login"
import Register from "./Akun/Register"

export default function Base() {
    const location = useLocation()
    const pathSegments = location.pathname.split('/')
    return (
        <div className="w-full flex justify-center p-4 max-w-[1440px]">
            <div className="bg-neutral-100 rounded-3xl shadow-2xl h-full p-4 self-stretch flex-1 max-w-full">
                <Routes>
                    <Route path={'/akun/masuk'} element={<BackToAccount/>}/>
                    <Route path={'/akun/daftar'} element={<BackToAccount/>}/>
                </Routes>
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

function BackToAccount() {
    return <div className='flex'>
        <Link to={'/akun'}>
            <div className="text-neutral-700 flex gap-2 items-center p-2 px-3 shadow cursor-pointer rounded-full">
                <FontAwesomeIcon icon={faArrowLeft}/>
            </div>
        </Link>
    </div>
}