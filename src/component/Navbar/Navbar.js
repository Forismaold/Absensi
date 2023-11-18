import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link, useLocation } from "react-router-dom"

export default function Navbar() {
    const akun = useSelector(state => state.source.account)
    const location = useLocation()
    const pathSegments = location?.pathname?.split('/') || 'ABSEN'
    const lastRouteName = pathSegments[pathSegments.length - 1]?.toLocaleUpperCase() || 'ABSEN'
    const [routeName, setRouteName] = useState(lastRouteName)
    useEffect(() => {
        setRouteName(lastRouteName)
    }, [lastRouteName])

    return <nav className="flex px-3 py-2 gap-2 flex-col md:flex-row w-full">
        <h4 className="font-montserrat text-neutral-100 font-extrabold text-2xl">Forisma.</h4>
        <div className="flex justify-between w-full text-neutral-200">
            <div className="flex gap-2">
                <Link to={'/absen'}>
                <div className={`${routeName === 'ABSEN' ? 'border-tertiary' : 'border-transparent'} h-full flex place-items-center pointer border-b-2 border-solid duration-200 ease-in-out active:scale-95`}>
                    <span>Absen</span>
                </div>
                </Link>
                <Link to={'/dashboard'}>
                <div className={`${routeName === 'DASHBOARD' ? 'border-tertiary' : 'border-transparent'} h-full flex place-items-center pointer border-b-2 border-solid duration-200 ease-in-out active:scale-95`}>
                    <span>Dashboard</span>
                </div>
                </Link>
            </div>
            <div className="flex gap-2">
                <Link to={'/akun'}>
                    <div className="h-full flex place-items-center pointer">
                        {akun ? <img src={akun?.avatar} alt={akun?.nickname || akun?.nama} className="w-[32px] h-[32px] rounded-full shadow duration-200 ease-in-out active:scale-95"/>: <span className="duration-200 ease-in-out active:scale-95">Akun</span>}
                    </div>
                </Link>
            </div>
        </div>
    </nav>
}