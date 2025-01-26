import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faBarsStaggered, faHouse, faPenRuler, faUser, faQrcode, faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons'
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
        <div className="px-3 py-1 mt-auto border-t bg-neutral-200 shadow-inner max-w-md rounded-s-md sm:flex hidden">
            <div className="flex justify-between text-neutral-700 max-w-sm">
                <span onClick={() => dispatch(setProMode(!proMode))} className="flex gap-2 items-center bg-secondary p-2 shadow-lg shadow-primary/50 click-animation rounded-lg text-neutral-100 cursor-pointer">{proMode ? 'Pro' : 'Lite'}<FontAwesomeIcon icon={faArrowRightArrowLeft}/></span>
                <div className="flex gap-4 items-center">
                    <Link to={'/absen'} className='h-full flex items-center'>
                    <div className={`${routeName === 'ABSEN' ? 'text-primary shadow-tertiary' : 'text-neutral-500'} flex p-1 px-4 gap-2 justify-center items-center pointer click-animation`}>
                        <FontAwesomeIcon className='text-xl' icon={faHouse}/>
                    </div>
                    </Link>
                    <Link to={'/absengoldenqr'} className='h-full flex items-center'>
                    <div className={`${routeName === 'ABSENGOLDENQR' ? 'text-primary shadow-tertiary' : 'text-neutral-500'} flex p-1 px-4 gap-2 justify-center items-center pointer click-animation`}>
                        <FontAwesomeIcon className='text-xl' icon={faQrcode}/>
                    </div>
                    </Link>
                    <Link to={'/dashboard'} className='h-full flex items-center'>
                    <div className={`${routeName === 'DASHBOARD' && !isAdminRoute ? 'text-primary shadow-tertiary' : 'text-neutral-500'} flex p-1 px-4 gap-2 justify-center items-center pointer click-animation`}>
                        <FontAwesomeIcon className='text-xl' icon={faBarsStaggered}/>
                    </div>
                    </Link>
                    {permission && 
                        <Link to={'/admin/server'} className='h-full flex items-center'>
                            <div className={`${isAdminRoute ? 'text-primary shadow-tertiary' : 'text-neutral-500'} flex p-1 px-4 gap-2 justify-center items-center pointer click-animation`}>
                                <FontAwesomeIcon className='text-xl' icon={faPenRuler}/>
                            </div>
                        </Link>
                    }
                </div>
                <div className="flex gap-2">
                    <Link to={'/akun'} className='w-full'>
                        <div className={`${routeName === 'AKUN' ? 'text-primary shadow-tertiary' : 'text-neutral-500'} h-full flex place-items-center pointer px-4 gap-2 click-animation w-full`}>
                            {akun ? <img src={akun?.avatar} alt={akun?.nickname || akun?.nama} referrerPolicy="no-referrer" className="w-[20px] h-[20px] rounded-full shadow"/>: <FontAwesomeIcon icon={faUser} className='text-xl'/>}
                        </div>
                    </Link>
                </div>
            </div>
        </div>
        <div className='sm:hidden'>
            {akun ? <div className="px-4" onClick={() => setShow(true)}><img src={akun?.avatar} alt={akun?.nickname || akun?.nama} referrerPolicy="no-referrer" className="w-8 h-8 rounded-full shadow cursor-pointer"/></div> : <FontAwesomeIcon icon={faBars} className='text-neutral-200 text-xl px-6 cursor-pointer' onClick={() => setShow(true)}/>}
            <Modal onClose={() => setShow(false)} zIndex={'z-[1001]'} isOpen={show} className='w-full flex flex-col gap-4 max-w-sm p-3'>
                <div onClick={() => {
                    dispatch(setProMode(!proMode))
                    setShow(false)
                }} className="flex gap-2 items-center justify-between bg-secondary p-2 shadow-lg shadow-primary/50 click-animation rounded-lg text-neutral-100 cursor-pointer"><span>Mode {proMode ? 'Pro' : 'Lite'}</span> <FontAwesomeIcon icon={faArrowRightArrowLeft}/></div>
                    <div className="flex flex-col gap-4">
                        <Link to={'/absen'} onClick={() => setShow(false)}>
                        <div className={`${routeName === 'ABSEN' ? 'text-primary shadow-tertiary' : 'text-neutral-500'} flex p-1 gap-2 items-center pointer click-animation`}>
                            <FontAwesomeIcon className='text-xl' icon={faHouse}/>
                            <span className="text-sm pt-1">Beranda</span>
                        </div>
                        </Link>
                        <Link to={'/absengoldenqr'} onClick={() => setShow(false)}>
                        <div className={`${routeName === 'ABSENGOLDENQR' ? 'text-primary shadow-tertiary' : 'text-neutral-500'} flex p-1 gap-2 items-center pointer click-animation`}>
                            <FontAwesomeIcon className='text-xl' icon={faQrcode}/>
                            <span className="text-sm pt-1">Golden QR (baru!)</span>
                        </div>
                        </Link>
                        <Link to={'/dashboard'} onClick={() => setShow(false)}>
                        <div className={`${routeName === 'DASHBOARD' && !isAdminRoute ? 'text-primary shadow-tertiary' : 'text-neutral-500'} flex p-1 gap-2 items-center pointer click-animation`}>
                            <FontAwesomeIcon className='text-xl' icon={faBarsStaggered}/>
                            <span className="text-sm pt-1">Dashboard</span>
                        </div>
                        </Link>
                        {permission && 
                            <Link to={'/admin/server'} onClick={() => setShow(false)}>
                                <div className={`${isAdminRoute ? 'text-primary shadow-tertiary' : 'text-neutral-500'} flex p-1 gap-2 items-center pointer click-animation`}>
                                    <FontAwesomeIcon className='text-xl' icon={faPenRuler}/>
                                    <span className="text-sm pt-1">Admin</span>
                                </div>
                            </Link>
                        }
                    </div>
                    <div className="flex gap-2">
                        <Link to={'/akun'} className='w-full' onClick={() => setShow(false)}>
                            <div className={`${routeName === 'AKUN' ? 'text-primary shadow-tertiary' : 'text-neutral-500'} h-full flex place-items-center pointer p-1 gap-2 click-animation w-full`}>
                                {akun ? <img src={akun?.avatar} alt={akun?.nickname || akun?.nama} referrerPolicy="no-referrer" className="w-[20px] h-[20px] rounded-full shadow"/>: <FontAwesomeIcon icon={faUser} className='text-xl'/>}
                                <span className="text-sm w-full truncate">{akun?.nickname || akun?.nama}</span>
                            </div>
                        </Link>
                    </div>
            </Modal>
        </div>
    </nav>
}