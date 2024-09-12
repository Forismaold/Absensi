import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserSlash } from "@fortawesome/free-solid-svg-icons"
import { useDispatch, useSelector } from "react-redux"
import Auth from "../../Akun/Auth"
import MyMap from "../MyMap/MyMap"
import { useEffect } from "react"
import { clearAbsensi } from "../../../../redux/source"
import MuatUlangAbsensi from "./MuatUlangAbsensi"
import Note from "../Note"
import DisplayStatusAbsenceUser from "./DisplayStatusAbsenceUser"
import AbsenceMethod from "../AbsenceMethod/AbsenceMethod"

export default function DetailAbsen() {
    const dispatch = useDispatch()
    const account = useSelector(state => state.source.account)

    useEffect(() => {
        return () => {
            dispatch(clearAbsensi())
        }
    }, [dispatch])
    
    return <div className='flex flex-col'>
        <MuatUlangAbsensi/>
        <Note/>
        <DisplayStatusAbsenceUser/>
        <CheckAccountExist/>
        <div className={`${!account && 'opacity-50'} flex flex-col gap-2`}>
            <MyMap/>
            <AbsenceMethod/>
        </div>
    </div>
}

function CheckAccountExist() {
    const account = useSelector(state => state.source.account)

    if (!account) return <div className='bg-quaternary p-2 py-6 rounded-md shadow-xl text-center'>
        <FontAwesomeIcon icon={faUserSlash} className='text-5xl text-primary p-2'/>
        <div>
            <h2 className='font-bold text-3xl text-neutral-700'>Masuk ke akun</h2>
            <p className='text-neutral-600'>Harap masuk atau daftar sebelum melakukan absensi</p>
        </div>
        <Auth/>
    </div>
    return null
}

