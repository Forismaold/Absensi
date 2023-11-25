import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoxOpen, faChevronDown, faChevronRight, faClockRotateLeft, faClose, faServer, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from "react-redux"
import { API, formatBeautyDate, getPermission } from "../../../utils"
import axios from "axios"
import { setUsers } from "../../../redux/users"
import { loadingToast } from '../../utils/myToast'
import UsersList from './UsersList'
import { useCallback, useEffect, useRef, useState } from 'react'
import { setAbsensi, setStatus } from '../../../redux/source'
import Modal, { Confirm } from '../../utils/Modal'
import { Link } from 'react-router-dom'

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
        <div className='flex gap-2 items-center justify-end'>
            <Link to={'/admin/dashboard'}><FontAwesomeIcon icon={faServer} className='rounded text-neutral-100 bg-secondary p-2 shadow-lg shadow-primary/50 duration-200 ease-in-out active:scale-95'/></Link>
            <Link to={'/admin/riwayat'}><FontAwesomeIcon icon={faClockRotateLeft} className='rounded text-neutral-100 bg-secondary p-2 shadow-lg shadow-primary/50 duration-200 ease-in-out active:scale-95'/></Link>
        </div>
        <DashboardActionButton/>
        <UsersList/>
    </div>
}

function DashboardActionButton() {
    const absensi = useSelector(state => state.source.absensi)
    const account = useSelector(state => state.source.account)

    const [openAbsensiOption, setOpenAbsensiOption] = useState(false)
    const [showTutupConfirm, setShowTutupConfirm] = useState(false)
    const [showBuangConfirm, setShowBuangConfirm] = useState(false)

    const dispatch = useDispatch()

    const fetchAbsenceStatus = useCallback(async() => {
        const promise = loadingToast('Mengecek status')
        try {
            await axios.get(API + '/absensi/status')
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

    async function bukaAbsensi(title = 'Dzuhur', note) {
        const promise = loadingToast('Membuka absensi')
        try {
            await axios.post(API + '/absensi/buka', {openedBy: account.nama, title, note})
            .then(res => {
                promise.onSuccess(res.data.msg)
                dispatch(setAbsensi(res.data.absensi))
                dispatch(setUsers())
                dispatch(setStatus())
                setOpenAbsensiOption(false)
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
            await axios.post(API + '/absensi/tutup', { closedBy: account?.nama })
            .then(res => {
                promise.onSuccess(`${res.data.msg}, Tidak absen: ${res.data.tidak}, Belum absen: ${res.data.belum}, Sudah absen: ${res.data.sudah}`)
                dispatch(setAbsensi())
                dispatch(setUsers())
                dispatch(setStatus())
                setOpenAbsensiOption(false)
            })
        } catch (error) {
            promise.onError('Internal server error')
        }
    }
    async function buangAbsensi() {
        const promise = loadingToast('Membuang absensi')
        try {
            await axios.post(API + '/absensi/buang', { closedBy: account?.nama })
            .then(res => {
                promise.onSuccess(`${res.data.msg}, Tidak absen: ${res.data.tidak}, Belum absen: ${res.data.belum}, Sudah absen: ${res.data.sudah}`)
                dispatch(setAbsensi())
                dispatch(setUsers())
                dispatch(setStatus())
            })
        } catch (error) {
            promise.onError('Internal server error')
        }
    }
    
    return <div className="flex py-2 gap-2 flex-col shadow-lg p-2 rounded my-2 bg-neutral-200">
        {absensi && <div className='flex flex-col'>
            <div className='flex flex-wrap flex-col sm:flex-row'>
                <p className='sm:w-2/6 font-semibold'>Status</p>
                <p>{absensi?.status ? "Buka" : "Tutup"}</p>
            </div>
            <div className='flex flex-wrap flex-col sm:flex-row'>
                <p className='sm:w-2/6 font-semibold'>{absensi?.status ? 'Dibuka oleh': 'Ditutup oleh'}</p>
                <p>{absensi?.openedBy || 'Anon'}</p>
            </div>
            <div className='flex flex-wrap flex-col sm:flex-row'>
                <p className='sm:w-2/6 font-semibold'>Pada</p>
                <p>{formatBeautyDate(absensi?.date)}</p>
            </div>
            <div className='flex flex-wrap flex-col sm:flex-row'>
                <p className='sm:w-2/6 font-semibold'>Catatan</p>
                <p>{absensi?.note || '-'}</p>
            </div>
        </div>}
        {absensi?.status ?
            <>
            <div className='flex gap-2 justify-end flex-wrap'>
                <div onClick={() => setShowTutupConfirm(true)} className='flex gap-2 shadow-lg shadow-primary/50 cursor-pointer bg-primary items-center p-2 rounded text-neutral-200 duration-200 ease-in-out active:scale-95'>
                    <FontAwesomeIcon icon={faClose}/>
                    <p>Tutup dan simpan</p>
                </div>
                <div onClick={() => setShowBuangConfirm(true)} className='flex gap-2 border-2 border-primary shadow-lg shadow-primary/50 cursor-pointer bg-transparent items-center p-2 rounded text-primary duration-200 ease-in-out active:scale-95'>
                    <FontAwesomeIcon icon={faTrash}/>
                    <p>Tutup dan Buang</p>
                </div>
            </div>
            </>
            :
            <>
            <div onClick={() => setOpenAbsensiOption(true)} className='flex gap-2 shadow-lg shadow-primary/50 cursor-pointer bg-primary items-center p-2 rounded text-neutral-200 duration-200 ease-in-out active:scale-95'>
                <FontAwesomeIcon icon={faBoxOpen}/>
                <p>Buka</p>
            </div>
            <AbsensiTitle isOpen={openAbsensiOption} onClose={() => setOpenAbsensiOption(false)} callBack={bukaAbsensi}/>
            </>
        }
        <Confirm isOpen={showTutupConfirm} title='Tutup dan simpan' subTitle='Menutup absensi dan menyimpannya sekarang?' onClose={() => setShowTutupConfirm(false)} callBack={tutupAbsensi} textConfirm='Simpan'/>
        <Confirm isOpen={showBuangConfirm} title='Tutup dan Buang' subTitle='Menutup absensi dan membuang perubahan absensi setiap pengguna?' onClose={() => setShowBuangConfirm(false)} callBack={buangAbsensi} textConfirm='Buang'/>
    </div>
}

function AbsensiTitle({isOpen, onClose, callBack}) {
    const [inputTitle, setInputTitle] = useState('Dzhuhur')
    const inputRef = useRef(null);
    const [showNote, setShowNote] = useState(false)
    const [inputNote, setInputNote] = useState('')

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
        callBack(inputTitle, inputNote)
    }

    return <Modal isOpen={isOpen} onClose={onClose}>
        <div className='text-neutral-500 flex flex-col gap-2 p-2'>
            <div className='flex flex-col'>
                <p className='flex-1'>Ketik judul absensi</p>
                <input ref={inputRef} type="text" placeholder='Bawaan: Dzuhur' className='shadow-lg shadow-primary/50 border-secondary rounded focus:ring-primary' onChange={handleInput} value={inputTitle} maxLength={20}/>
                <p className='flex-1 mt-2 duration-200 ease-in-out active:scale-95 cursor-pointer' onClick={() => setShowNote(prev => !prev)}>Tambahkan catatan <FontAwesomeIcon icon={showNote ? faChevronDown : faChevronRight}/></p>
                {showNote && <textarea className='shadow-lg shadow-primary/50 border-secondary rounded focus:ring-primary' placeholder='Ketik catatan' onChange={e => setInputNote(e.target.value)}/>}
            </div>
            <div onClick={handleCallback} className={`flex-1 bg-secondary shadow-lg shadow-secondary/50 text-neutral-200 p-2 duration-200 ease-in-out active:scale-95 rounded flex justify-center shadow cursor-pointer hover:shadow-xl duration-300 hover:-translate-y-1`}>
                <span>Buka absensi</span>
            </div>
        </div>
    </Modal>
}