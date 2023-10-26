import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"

export default function Navbar() {
    const location = useLocation()
    const pathSegments = location?.pathname?.split('/') || 'ABSEN'
    const lastRouteName = pathSegments[pathSegments.length - 1]?.toLocaleUpperCase() || 'ABSEN'
    const [routeName, setRouteName] = useState(lastRouteName)
    useEffect(() => {
        setRouteName(lastRouteName)
    }, [lastRouteName])

    return <nav className="flex px-3 justify-between py-2">
        <div className="flex gap-3">
            <h4 className="font-montserrat text-neutral-700 font-extrabold text-2xl">Forisma.</h4>
            <div className="flex gap-2 text-neutral-600">
                <Link to={'/absen'}>
                <div className={`${routeName === 'ABSEN' && 'border-indigo-500'} h-full flex place-items-center pointer border-b-2 border-solid`}>
                    <span>Absen</span>
                </div>
                </Link>
                <Link to={'/admin/dashboard'}>
                <div className={`${routeName === 'DASHBOARD' && 'border-indigo-500'} h-full flex place-items-center pointer border-b-2 border-solid`}>
                    <span>Dashboard</span>
                </div>
                </Link>
            </div>
        </div>
        <div className="flex gap-2">
            <div className="h-full flex place-items-center pointer">
                <span>Akun</span>
            </div>
        </div>
    </nav>
}