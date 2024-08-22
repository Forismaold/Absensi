import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBarsStaggered, faHouse, faPenRuler } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link, useLocation } from "react-router-dom"
import { getPermission } from "../../utils"

export default function Navbar() {
    const akun = useSelector(state => state.source.account)
    const location = useLocation()
    const pathSegments = location?.pathname?.split('/') || 'ABSEN'
    const lastRouteName = pathSegments[pathSegments.length - 1]?.toLocaleUpperCase() || 'ABSEN'
    const [isAdminRoute, setIsAdminRoute] = useState(false)
    const [routeName, setRouteName] = useState(lastRouteName)
    useEffect(() => {
        setRouteName(lastRouteName)
        setIsAdminRoute(location.pathname.split('/')[1].toUpperCase() === 'ADMIN')
    }, [lastRouteName, location.pathname])
    const [permission, setPermission] = useState(false)

    useEffect(() => {
        setPermission(getPermission())
    }, [akun])

    return <nav className="flex px-3 py-2 gap-2 flex-col w-full mt-auto border-t fixed bottom-0 bg-neutral-200 z-[1001]">
        <div className="flex justify-between w-full text-neutral-700">
            <div className="flex gap-4">
                <Link to={'/absen'}>
                <div className={`${routeName === 'ABSEN' ? 'bg-tertiary rounded text-neutral-600 shadow-tertiary' : 'text-neutral-500'} flex pt-1 px-4 flex-col items-center pointer border border-solid click-animation`}>
                    <FontAwesomeIcon className='text-xl' icon={faHouse}/>
                    <span className="text-[8px] pt-1">Absen</span>
                </div>
                </Link>
                <Link to={'/dashboard'}>
                <div className={`${routeName === 'DASHBOARD' && !isAdminRoute ? 'bg-tertiary rounded text-neutral-600 shadow-tertiary' : 'text-neutral-500'} flex pt-1 px-4 flex-col items-center pointer border border-solid click-animation`}>
                    <FontAwesomeIcon className='text-xl' icon={faBarsStaggered}/>
                    <span className="text-[8px] pt-1">Dashboard</span>
                </div>
                </Link>
                {permission && 
                    <Link to={'/admin/server'}>
                        <div className={`${isAdminRoute ? 'bg-tertiary rounded text-neutral-600 shadow-tertiary' : 'text-neutral-500'} flex pt-1 px-4 flex-col items-center pointer border border-solid click-animation`}>
                            <FontAwesomeIcon className='text-xl' icon={faPenRuler}/>
                            <span className="text-[8px] pt-1">Admin</span>
                        </div>
                    </Link>
                }
            </div>
            <div className="flex gap-2">
                <Link to={'/akun'}>
                    <div className={`${routeName === 'AKUN' ? 'bg-tertiary rounded text-neutral-600 shadow-tertiary' : 'text-neutral-500'} h-full flex place-items-center pointer p-1 px-4 flex-col`}>
                        {akun ? <img src={akun?.avatar} alt={akun?.nickname || akun?.nama} referrerPolicy="no-referrer" className="w-[20px] h-[20px] rounded-full shadow click-animation"/>: <span className="click-animation">Akun</span>}
                        <span className="text-[8px] pt-1">Profil</span>
                    </div>
                </Link>
            </div>
        </div>
    </nav>
}