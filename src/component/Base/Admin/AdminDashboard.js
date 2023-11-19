import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoxOpen, faClose, faMagnifyingGlass, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from "react-redux"
import { API, formatBeautyDate, getPermission } from "../../../utils"
import axios from "axios"
import { setUsers } from "../../../redux/users"
import { loadingToast } from '../../utils/myToast'
import UsersList from './UsersList'
import { useCallback, useEffect, useRef, useState } from 'react'
import { setAbsensi } from '../../../redux/source'
import Modal from '../../utils/Modal'

export default function AdminDashboard() {
    const [permission, setPermission] = useState(false)

    useEffect(() => {
        setPermission(getPermission())
    }, [])

    if (!permission) return <div>
        <p>Anda bukan pengelola!</p>
    </div>

    return <div>
        <p>ini halaman admin</p>
        <DashboardActionButton/>
        <UsersList/>
    </div>
}

function DashboardActionButton() {
    const absensi = useSelector(state => state.source.absensi)
    const account = useSelector(state => state.source.account)

    const [openAbsensiTitle, setOpenAbsensiTitle] = useState(false)

    const dispatch = useDispatch()

    const fetchAbsenceStatus = useCallback(async() => {
        const promise = loadingToast('Mengecek status')
        try {
            axios.get(API + '/absensi/status')
            .then(res => {
                dispatch(setAbsensi(res.data.absensi))
                console.log(res.data.absensi)

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

    async function bukaAbsensi(title = 'Dzuhur') {
        const promise = loadingToast('Membuka absensi')
        try {
            await axios.post(API + '/absensi/buka', {openedBy: account.nama, title})
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
    async function buangAbsensi() {
        const promise = loadingToast('Membuang absensi')
        try {
            await axios.post(API + '/absensi/buang')
            .then(res => {
                promise.onSuccess(`${res.data.msg}, Tidak absen: ${res.data.tidak}, Belum absen: ${res.data.belum}, Sudah absen: ${res.data.sudah}`)
                dispatch(setAbsensi({status: false}))
                dispatch(setUsers(null))
            })
        } catch (error) {
            promise.onError('Internal server error')
        }
    }

    return <div className="flex justify-end py-2 gap-2 flex-wrap flex-col">
        {absensi?.status ?
            <>
            <div className='flex flex-col'>
                <p>Dibuka pada {formatBeautyDate(absensi?.date)} oleh {absensi?.openedBy}</p>
            </div>
            <div className='flex gap-2 justify-end'>
                <div onClick={tutupAbsensi} className='flex gap-2 shadow-lg shadow-primary/50 cursor-pointer bg-primary items-center p-2 rounded text-neutral-200 duration-200 ease-in-out active:scale-95'>
                    <FontAwesomeIcon icon={faClose}/>
                    <p>Tutup dan simpan</p>
                </div>
                <div onClick={buangAbsensi} className='flex gap-2 shadow-lg shadow-primary/50 cursor-pointer bg-primary items-center p-2 rounded text-neutral-200 duration-200 ease-in-out active:scale-95'>
                    <FontAwesomeIcon icon={faTrash}/>
                    <p>Buang</p>
                </div>
            </div>
            </>
            :
            <>
            <div onClick={() => setOpenAbsensiTitle(true)} className='flex gap-2 shadow-lg shadow-primary/50 cursor-pointer bg-primary items-center p-2 rounded text-neutral-200 duration-200 ease-in-out active:scale-95'>
                <FontAwesomeIcon icon={faBoxOpen}/>
                <p>Buka</p>
            </div>
            <AbsensiTitle isOpen={openAbsensiTitle} onClose={() => setOpenAbsensiTitle(false)} callBack={bukaAbsensi}/>
            </>
        }
        <div onClick={fetchAbsenceStatus} className='flex gap-2 shadow-lg shadow-primary/50 cursor-pointer bg-primary items-center self-end p-2 rounded text-neutral-200 duration-200 ease-in-out active:scale-95'>
            <FontAwesomeIcon icon={faMagnifyingGlass}/>
            <p>Cek status absensi</p>
        </div>
    </div>
}

function AbsensiTitle({isOpen, onClose, callBack}) {
    const [inputTitle, setInputTitle] = useState('Dzhuhur')
    const inputRef = useRef(null);

    function handleInput(e) {
        setInputTitle(e.target.value)
    }

    useEffect(() => {
        if (isOpen) {
            if (!inputTitle) setInputTitle('Dzhuhur')
            inputRef.current.focus();
            inputRef.current.select()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen])

    function handleCallback() {
        callBack(inputTitle)
    }

    return <Modal isOpen={isOpen} onClose={onClose} zIndex={'z-[1001]'}>
        <div className='text-neutral-500 rounded-lg p-4 flex flex-col gap-2 shadow-lg shadow-primary/50'>
            <div className='flex flex-col'>
                <label htmlFor="FNCB" className='flex-1'>Ketik judul absensi</label>
                <input ref={inputRef} type="text" id='FNCB' placeholder='Bawaan: Dzuhur' className='checked:bg-primary shadow-lg shadow-primary/50 border-secondary rounded focus:ring-primary' onChange={handleInput} value={inputTitle} maxLength={20}/>
            </div>
            <div onClick={handleCallback} className={`flex-1 bg-secondary shadow-lg shadow-secondary/50 text-neutral-200 p-2 duration-200 ease-in-out active:scale-95 rounded flex justify-center shadow cursor-pointer hover:shadow-xl duration-300 hover:-translate-y-1`}>
                <span>Buka absensi</span>
            </div>
        </div>
    </Modal>
}