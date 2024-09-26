import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faBarsStaggered, faHouse, faPenRuler, faUser } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { getPermission } from "../../utils"
import { setProMode } from "../../redux/source"
import { useDispatch, useSelector } from "react-redux"
import Modal from '../utils/Modal'

export default function Navbar() {
    const [show, setShow] = useState(false)
    const akun = useSelector(state => state.source.account)
    const location = useLocation()
    const pathSegments = location?.pathname?.split('/') || 'ABSEN'
    const lastRouteName = pathSegments[pathSegments.length - 1]?.toLocaleUpperCase() || 'ABSEN'
    const [isAdminRoute, setIsAdminRoute] = useState(false)
    const [routeName, setRouteName] = useState(lastRouteName)
    const proMode = useSelector(state => state.source.proMode)
    const dispatch = useDispatch()
    useEffect(() => {
        setRouteName(lastRouteName)
        setIsAdminRoute(location.pathname.split('/')[1].toUpperCase() === 'ADMIN')
    }, [lastRouteName, location.pathname])
    const [permission, setPermission] = useState(false)

    useEffect(() => {
        setPermission(getPermission())
    }, [akun])

    return <nav>
        <FontAwesomeIcon icon={faBars} className='text-neutral-200 text-xl px-6 cursor-pointer' onClick={() => setShow(true)}/>
        <Modal onClose={() => setShow(false)} zIndex={'z-[1001]'} isOpen={show}>
            <div className="flex px-3 py-1 gap-2 flex-col w-full mt-auto border-t bg-neutral-200 shadow-inner max-w-sm">
                <div className="flex flex-col justify-between w-full text-neutral-700 gap-4 max-w-sm">
                <span onClick={() => dispatch(setProMode(!proMode))} className="flex gap-2 items-center bg-secondary p-2 shadow-lg shadow-primary/50 click-animation rounded-lg text-neutral-100 cursor-pointer">{proMode ? 'Pro' : 'Lite'}</span>
                    <div className="flex flex-col gap-4">
                        <Link to={'/absen'}>
                        <div className={`${routeName === 'ABSEN' ? 'text-primary shadow-tertiary' : 'text-neutral-500'} flex p-1 px-4 flex-col items-center pointer click-animation`}>
                            <FontAwesomeIcon className='text-xl' icon={faHouse}/>
                            <span className="text-[7px] pt-1">Beranda</span>
                        </div>
                        </Link>
                        <Link to={'/dashboard'}>
                        <div className={`${routeName === 'DASHBOARD' && !isAdminRoute ? 'text-primary shadow-tertiary' : 'text-neutral-500'} flex p-1 px-4 flex-col items-center pointer click-animation`}>
                            <FontAwesomeIcon className='text-xl' icon={faBarsStaggered}/>
                            <span className="text-[7px] pt-1">Dashboard</span>
                        </div>
                        </Link>
                        {permission && 
                            <Link to={'/admin/server'}>
                                <div className={`${isAdminRoute ? 'text-primary shadow-tertiary' : 'text-neutral-500'} flex p-1 px-4 flex-col items-center pointer click-animation`}>
                                    <FontAwesomeIcon className='text-xl' icon={faPenRuler}/>
                                    <span className="text-[7px] pt-1">Admin</span>
                                </div>
                            </Link>
                        }
                    </div>
                    <div className="flex gap-2">
                        <Link to={'/akun'}>
                            <div className={`${routeName === 'AKUN' ? 'text-primary shadow-tertiary' : 'text-neutral-500'} h-full flex place-items-center pointer p-1 px-4 flex-col click-animation`}>
                                {akun ? <img src={akun?.avatar} alt={akun?.nickname || akun?.nama} referrerPolicy="no-referrer" className="w-[20px] h-[20px] rounded-full shadow"/>: <FontAwesomeIcon icon={faUser} className='text-xl'/>}
                                <span className="text-[7px] pt-1">Profil</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </Modal>
    </nav>
}