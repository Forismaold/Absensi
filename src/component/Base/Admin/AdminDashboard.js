import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoxOpen, faClose, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from "react-redux"
import { API } from "../../../utils"
import axios from "axios"
import { setUsers } from "../../../redux/users"
import { loadingToast } from '../../utils/myToast'
import UsersList from './UsersList'
import { useCallback, useEffect } from 'react'
import { setAbsensi } from '../../../redux/source'

export default function AdminDashboard() {
    return <div>
        <p>ini halaman admin</p>
        <DashboardActionButton/>
        <UsersList/>
    </div>
}

function DashboardActionButton() {
    const absensi = useSelector(state => state.source.absensi)
    const account = useSelector(state => state.source.account)

    const dispatch = useDispatch()

    const fetchAbsenceStatus = useCallback(async() => {
        const promise = loadingToast('Mengecek status')
        try {
            axios.get(API + '/absensi/status')
            .then(res => {
                dispatch(setAbsensi(res.data.absensi))
                promise.onSuccess(res.data.msg)
            })
            .catch(err => {
                promise.onError(err?.response?.data?.msg || 'internal server error')
                console.log(err)
            })
        } catch (error) {
            
        }
    }, [dispatch])

    useEffect(() => {
        if (!absensi) fetchAbsenceStatus()
    }, [absensi, fetchAbsenceStatus])

    async function bukaAbsensi() {
        const promise = loadingToast('Membuka absensi')
        try {
            await axios.post(API + '/absensi/buka', {openedBy: account.nama})
            .then(res => {
                promise.onSuccess(res.data.msg)
                dispatch(setAbsensi(res.data.absensi))
                dispatch(setUsers([]))
            }).catch(err => {
                console.log(err)
                promise.onError(err.response.data.msg)
            })
        } catch (error) {
            console.log(error);
            promise.onError('Internal server error')
        }
    }
    async function tutupAbsensi() {
        const promise = loadingToast('Menutup absensi')
        try {
            await axios.post(API + '/absensi/tutup')
            .then(res => {
                promise.onSuccess(`${res.data.msg}, Tidak absen: ${res.data.tidak}, Belum absen: ${res.data.belum}, Sudah absen: ${res.data.sudah}`)
                dispatch(setAbsensi({status: false}))
                dispatch(setUsers(null))
            })
        } catch (error) {
            promise.onError('Internal server error')
        }
    }

    return <div className="flex justify-end py-2 gap-2 flex-wrap">
        {absensi?.status ?
            <div onClick={tutupAbsensi} className='flex gap-2 shadow-lg shadow-primary/50 cursor-pointer bg-primary items-center p-2 rounded text-neutral-200'>
                <FontAwesomeIcon icon={faClose}/>
                <p>Tutup</p>
            </div>
            :
            <div onClick={bukaAbsensi} className='flex gap-2 shadow-lg shadow-primary/50 cursor-pointer bg-primary items-center p-2 rounded text-neutral-200'>
                <FontAwesomeIcon icon={faBoxOpen}/>
                <p>Buka</p>
            </div>
        }
        <div onClick={fetchAbsenceStatus} className='flex gap-2 shadow-lg shadow-primary/50 cursor-pointer bg-primary items-center p-2 rounded text-neutral-200'>
            <FontAwesomeIcon icon={faMagnifyingGlass}/>
            <p>Cek status</p>
        </div>
    </div>
}