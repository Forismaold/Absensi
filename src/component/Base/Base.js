import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import Absen from "./Absen/Absen"
import Akun from "./Akun/Akun"
import { Routes, Route, useLocation, Link } from 'react-router-dom'
import Login from "./Akun/Login"
import Register from "./Akun/Register"
import Dahsboard from './Dashboard/Dashboard'
import AdminRiwayat from './Admin/AdminRiwayat'
import AdminServer from './Admin/AdminServer'

export default function Base() {
    const location = useLocation()
    const pathSegments = location.pathname.split('/')
    return (
        <div className="w-full flex justify-center p-4 max-w-[1440px]">
            <div className="bg-neutral-100 rounded-3xl shadow-2xl h-full p-4 self-stretch flex-1 max-w-full">
                <Routes>
                    <Route path={'/akun/masuk'} element={<BackTo to={'/akun'}/>}/>
                    <Route path={'/akun/daftar'} element={<BackTo to={'/akun'}/>}/>
                </Routes>
                <h5 className="text-3xl font-bold text-neutral-700 capitalize pt-4">{pathSegments[pathSegments.length - 1] || 'Absen'}</h5>
                <Routes>
                    <Route path={'*'} element={<Absen/>}></Route>
                    <Route path={'/dashboard'} element={<Dahsboard/>}></Route>
                    <Route path={'/admin/server'} element={<AdminServer/>}></Route>
                    <Route path={'/admin/riwayat'} element={<AdminRiwayat/>}></Route>
                    <Route path={'/akun'} element={<Akun/>}></Route>
                    <Route path={'/akun/masuk'} element={<Login/>}></Route>
                    <Route path={'/akun/daftar'} element={<Register/>}></Route>
                </Routes>
            </div>
        </div>
    )
}

function BackTo({to = '/absen'}) {
    return <div className='flex'>
        <Link to={to}>
            <div className="text-neutral-700 flex gap-2 items-center p-2 px-3 shadow cursor-pointer rounded-full">
                <FontAwesomeIcon icon={faArrowLeft}/>
            </div>
        </Link>
    </div>
}