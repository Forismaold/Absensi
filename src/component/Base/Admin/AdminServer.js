import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoxOpen, faClockRotateLeft, faDoorClosed, faEllipsisV, faExternalLink, faFloppyDisk, faLink, faPenToSquare, faPlus, faRefresh, faSearch, faServer, faTable, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useSelector } from "react-redux"
import { API, formatBeautyDate, getPermission } from "../../../utils"
import axios from "axios"
import { blankToast, loadingToast } from '../../utils/myToast'
import UsersList from './UsersList'
import { useCallback, useEffect, useState } from 'react'
import Modal, { Confirm } from '../../utils/Modal'
import { Link, Route, Routes, useNavigate, useSearchParams } from 'react-router-dom'
import LoadingSkeleton from '../../utils/LoadingSkeleton'
import AbsensiEditor from './AbsensiEditor'
import DisplayTableUsers from './DisplayTableUsers'

export default function AdminServer() {
    const [permission, setPermission] = useState(false)

    useEffect(() => {
        setPermission(getPermission())
    }, [])

    if (!permission) return <div>
        <p>Anda bukan pengelola!</p>
    </div>

    return <div className='flex flex-col gap-2'>
        <div className='flex items-center rounded shadow overflow-hidden'>
            <Link to={'/admin/server'} className='flex flex-1 px-4 items-center py-2 gap-2 click-animation border-b-2 border-secondary text-secondary bg-quaternary'>
                <FontAwesomeIcon icon={faServer}/> Server
            </Link>
            <Link to={'/admin/riwayat'} className='flex flex-1 px-4 items-center py-2 gap-2 click-animation border-b-2 border-transparent text-neutral-500 bg-neutral-200'>
                <FontAwesomeIcon icon={faClockRotateLeft}/> Riwayat
            </Link>
        </div>
        {/* <DashboardActionButton/> */}
        {/* <UsersList/> */}
        <Routes>
            <Route path='/' Component={ManageAbsence}/>
            <Route path='/detail' Component={DetailAbsence}/>
        </Routes>
    </div>
}

function DetailAbsence() {
    const [absensi, setAbsensi] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [inputSearch, setInputSearch] = useState('')
    
    const [searchParams, setSearchParams] = useSearchParams()

    const fetchData = useCallback(async () => {
        try {
            await axios.get(API + '/absensi/detail/' + searchParams.get('q'))
            .then(res => {
                setIsLoading(false)
                setAbsensi(res.data.data)
                console.log(res.data.data)
            }).catch(err => {
                throw new Error(err)
            })
        } catch (error) {
            setIsLoading(false)
        }
    }, [searchParams])

    useEffect(() => {
        if (!absensi) fetchData()
    },[absensi, fetchData])

    function handleSubmit(e) {
        e.preventDefault()
        searchParams.set('q', inputSearch)
        setSearchParams(searchParams)
    }

    if (!searchParams.get('q')) return <div className='flex flex-col gap-2'>
        <span>Masukkan id</span>
        <form className='flex items-center border-secondary rounded-md shadow-primary/50 border-2' onSubmit={handleSubmit}>
            <input autoFocus type="text" placeholder='Id absensi' className='flex-1 border-none rounded-s-md focus:ring-none' value={inputSearch} onChange={e => setInputSearch(e.target.value)} />
            <button type='submit' className='bg-secondary text-neutral-200 p-3 click-animation flex justify-center shadow cursor-pointer'><FontAwesomeIcon icon={faSearch}/></button>
        </form>
    </div>
    return <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-end' onClick={fetchData}>
            <div className='flex gap-2 items-center bg-secondary p-2 shadow-lg shadow-primary/50 click-animation rounded-lg text-neutral-100 cursor-pointer'>
                <FontAwesomeIcon icon={faRefresh}/> Segarkan
            </div>
        </div>
        {isLoading && <LoadingSkeleton/>}
        <DashboardActionButton item={absensi}/>
        <UsersList users={absensi?.users} absenceData={absensi}/>
    </div>
}
function ManageAbsence() {
    const account = useSelector(state => state.source.account)
    const [isLoading, setIsLoading] = useState(false)
    const [fetchError, setFetchError] = useState(false)
    const [abcenceList, setAbcenceList] = useState(null)
    const [openCreateAbsence, setOpenCreateAbsence] = useState(false)

    const fetchAbsence = useCallback(async () => {
        setIsLoading(true)
        setFetchError(false)
        try {
            await axios.get(API + '/absensi').then(res => {
                setAbcenceList(res.data.data)
            }).catch(err => {
                throw new Error(err)
            })
        } catch (error) {
            console.log(error)
            setFetchError(true)
        } finally {
            setIsLoading(false)
        }
    }, [])

    async function createAbsence(title, note, coordinates) {
        const promise = loadingToast('Membuat absensi baru')
        try {
            console.log('absensi api:',API + '/absensi');
            await axios.post(API + '/absensi', {
                title,
                note,
                coordinates,
                openedBy: account?.panggilan || account.nama
            }).then(res => {
                promise.onSuccess('berhasil menambahkan absensi')
                setOpenCreateAbsence(false)
                setAbcenceList(res.data.data)
            }).catch(err => {
                throw new Error(err)
            })
        } catch (error) {
            promise.onError('Gagal menambahkan absensi')
        }
    }

    useEffect(() => {
        if (!abcenceList) fetchAbsence()
    },[abcenceList, fetchAbsence])

    return <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-end' onClick={fetchAbsence}>
            <div className='flex gap-2 items-center bg-secondary p-2 shadow-lg shadow-primary/50 click-animation rounded-lg text-neutral-100 cursor-pointer'>
                <FontAwesomeIcon icon={faRefresh} className={`${isLoading && 'animate-spin'}`}/> Segarkan
            </div>
        </div>
        {isLoading && <LoadingSkeleton/>}
        {fetchError && <span>Gagal mendapatkan data!</span>}
        {abcenceList?.map(item => <DashboardActionButton item={item} key={item._id}/>) || []}
        {abcenceList?.filter(Boolean)?.length === 0 && <span className='text-center'>Tidak ada absensi</span>}
        <div className='flex items-center justify-end' onClick={() => setOpenCreateAbsence(true)}>
            <div className='flex gap-2 items-center bg-primary p-2 shadow-lg shadow-primary/50 click-animation rounded-lg text-neutral-100 cursor-pointer'>
                <FontAwesomeIcon icon={faPlus}/> Baru
            </div>
        </div>
        <AbsensiEditor isOpen={openCreateAbsence} onClose={() => setOpenCreateAbsence(false)} callBack={createAbsence}/>
    </div>
}

function DashboardActionButton({ item }) {
    const [absensi, setAbsensi] = useState(item)
    const account = useSelector(state => state.source.account)

    const [openEdit, setOpenEdit] = useState(false)
    const [showSaveConfirm, setShowSaveConfirm] = useState(false)
    const [showBuangConfirm, setShowBuangConfirm] = useState(false)
    const [isOpenMore, setIsOpenMore] = useState(false)
    const [showUsers, setShowUsers] = useState(false)

    const navigate = useNavigate()

    // const fetchAbsenceStatus = useCallback(async() => {
    //     const promise = loadingToast('Mengecek status')
    //     try {
    //         await axios.get(API + '/absensi/status')
    //         .then(res => {
    //             dispatch(setAbsensi(res.data.absensi))

    //             promise.onSuccess(res.data.msg)
    //         })
    //         .catch(err => {
    //             promise.onError(err?.response?.data?.msg || 'internal server error')
    //             console.log(err)
    //         })
    //     } catch (error) {
            
    //     }
    // }, [dispatch])

    // useEffect(() => {
    //     if (!absensi) fetchAbsenceStatus()
    // }, [absensi, fetchAbsenceStatus])

    useEffect(() => {
        setAbsensi(item)
        console.log('item absence', item)
    },[item])

    async function bukaAbsensi() {
        const promise = loadingToast('Membuka absensi')
        try {
            await axios.post(API + '/absensi/buka/' + absensi?._id, {status: absensi.status})
            .then(res => {
                promise.onSuccess(res.data.msg)
                setAbsensi(res.data.absensi)
            }).catch(err => {
                console.log(err)
                promise.onError(err.response.data.msg)
            })
        } catch (error) {
            console.log(error);
            promise.onError('Internal server error')
        }
    }
    async function editAbsensi(title, note, coordinates) {
        const promise = loadingToast('Mengedit Absensi')
        try {
            await axios.put(API + '/absensi/' + absensi?._id, {title, note, coordinates, openedBy: account?.panggilan || account.nama})
            .then(res => {
                promise.onSuccess(res.data.msg)
                setOpenEdit(false)
                setAbsensi(res.data.absensi)
            }).catch(err => {
                console.log(err)
                promise.onError(err.response.data.msg)
            })
        } catch (error) {
            console.log(error);
            promise.onError('Internal server error')
        }
    }

    async function saveAbsensi() {
        const promise = loadingToast('Menutup absensi')
        try {
            await axios.post(API + '/absensi/simpan/' + absensi?._id, {status: absensi.status})
            .then(res => {
                // promise.onSuccess(`${res.data.msg}, Tidak absen: ${res.data.tidak}, Sudah absen: ${res.data.sudah}`)
                console.log(res.data)
                // dispatch(setAbsensi())
                // dispatch(setUsers())
                // dispatch(setStatus())
                setShowSaveConfirm(false)
                setAbsensi(null)
                navigate('/admin/server')
                promise.onSuccess('Berhasil menyimpan data')
            }).catch(err => {
                promise.onError('Gagal menyimpan data')
            })
        } catch (error) {
            promise.onError('Internal server error')
        }
    }
    async function tutupAbsensi() {
        const promise = loadingToast('Menutup absensi')
        try {
            await axios.post(API + '/absensi/tutup/' + absensi?._id, { closedBy: account?.nama, status: absensi?.status })
            .then(res => {
                // promise.onSuccess(`${res.data.msg}, Tidak absen: ${res.data.tidak} Sudah absen: ${res.data.sudah}`)
                promise.onSuccess(res.data.msg)
                setAbsensi(res.data.absensi)
            })
        } catch (error) {
            promise.onError('Internal server error')
        }
    }
    async function buangAbsensi() {
        const promise = loadingToast('Membuang absensi')
        try {
            await axios.delete(API + '/absensi/buang/' + absensi?._id)
            .then(res => {
                promise.onSuccess('Absensi berhasil dihapus')
                setShowBuangConfirm(false)
                navigate('/admin/server')
                setAbsensi(null)
            }).catch(err => {
                promise.onError('Gagal menghapus data')
            })
        } catch (error) {
            promise.onError('Internal server error')
        }
    }

    if (!absensi) return <p className='bg-neutral-200 p-2 text-center rounded'>Berhasil dihapus!</p>
    
    return <div className="relative flex py-2 gap-2 flex-col shadow-lg p-2 rounded my-2 bg-neutral-200">
        <div className='absolute top-2 right-2 cursor-pointer click-animation grid items-center px-4 py-2' onClick={() => setIsOpenMore(true)}>
            <FontAwesomeIcon icon={faEllipsisV}/>
        </div>
        {absensi && <div className='flex flex-col'>
            <div className='flex flex-wrap flex-col sm:flex-row'>
                <p className='sm:w-2/6 font-semibold'>Judul</p>
                <p>{absensi?.title}</p>
            </div>
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
                <p className='sm:w-2/6 font-semibold'>Koordinat Pertama</p>
                <p className='max-w-full overflow-auto'>{absensi?.coordinates?.first?.join(',') || '-'}</p>
            </div>
            <div className='flex flex-wrap flex-col sm:flex-row'>
                <p className='sm:w-2/6 font-semibold'>Koordinat Kedua</p>
                <p className='max-w-full overflow-auto'>{absensi?.coordinates?.second?.join(',') || '-'}</p>
            </div>
            <div className='flex flex-wrap flex-col sm:flex-row'>
                <p className='sm:w-2/6 font-semibold'>Catatan</p>
                <p>{absensi?.note || '-'}</p>
            </div>
            <div className='flex flex-wrap flex-col sm:flex-row'>
                <p className='sm:w-2/6 font-semibold'>Jumlah Peserta</p>
                <p>{absensi?.tickets?.length || '-'}</p>
            </div>
        </div>}
        <div className='flex gap-2 justify-end flex-wrap'>
            <div className='flex gap-2 shadow-lg shadow-primary/50 cursor-pointer text-primary items-center p-2 rounded border-primary border-2 border-solid click-animation' onClick={() => setShowSaveConfirm(true)}>
                <FontAwesomeIcon icon={faFloppyDisk}/>
                <p>Simpan</p>
            </div>
            {absensi?.status ?
                <>
                    <div onClick={tutupAbsensi} className='flex gap-2 bg-primary shadow-lg shadow-primary/50 cursor-pointer items-center p-2 rounded text-neutral-200 click-animation'>
                        <FontAwesomeIcon icon={faDoorClosed}/>
                        <p>Tutup</p>
                    </div>
                </>
                :
                <>
                <div onClick={bukaAbsensi} className='flex flex-1 justify-center gap-2 shadow-lg shadow-primary/50 cursor-pointer bg-primary items-center p-2 rounded text-neutral-200 click-animation'>
                    <FontAwesomeIcon icon={faBoxOpen}/>
                    <p>Buka</p>
                </div>
                </>
            }
        </div>
        <Modal isOpen={isOpenMore} onClose={() => setIsOpenMore(false)}>
            <div className='flex flex-col gap-2'>
                <div className='flex gap-2 items-center click-animation cursor-pointer p-2 hover:bg-tertiary rounded' onClick={() => navigate(`/admin/server/detail?q=${absensi._id}`)}>
                    <FontAwesomeIcon icon={faExternalLink}/> Detail
                </div>
                <div className='flex gap-2 items-center click-animation cursor-pointer p-2 hover:bg-tertiary rounded' onClick={() => {
                    navigator.clipboard.writeText(window.location.origin + '/absen/' + absensi?._id)
                    blankToast('Link disimpan di papan klip')
                    setIsOpenMore(false)
                }}>
                    <FontAwesomeIcon icon={faLink}/> Salin link Absensi
                </div>
                <div className='flex gap-2 items-center click-animation cursor-pointer p-2 hover:bg-tertiary rounded' onClick={() => {
                    setShowUsers(true)
                    setIsOpenMore(false)
                    }}>
                    <FontAwesomeIcon icon={faTable}/> Peserta
                </div>
                <div className='flex gap-2 items-center click-animation cursor-pointer p-2 hover:bg-tertiary rounded' onClick={() => {
                    setOpenEdit(true)
                    setIsOpenMore(false)
                }}>
                    <FontAwesomeIcon icon={faPenToSquare}/> Edit
                </div>
                <div className='flex gap-2 items-center click-animation cursor-pointer p-2 hover:bg-tertiary rounded' onClick={() => {
                    setIsOpenMore(false)
                    setShowBuangConfirm(true)
                }}>
                    <FontAwesomeIcon icon={faTrash}/> Buang
                </div>
            </div>
        </Modal>
        <Confirm isOpen={showSaveConfirm} title='Tutup dan simpan' subTitle={`Menutup absensi ${absensi?.title} dan menyimpannya sekarang?`} onClose={() => setShowSaveConfirm(false)} callBack={saveAbsensi} textConfirm='Simpan'/>
        {/* <Confirm isOpen={showSaveConfirm} title='Tutup dan simpan' subTitle='Menutup absensi dan menyimpannya sekarang?' onClose={() => setShowSaveConfirm(false)} callBack={tutupAbsensi} textConfirm='Simpan'/> */}
        <Confirm isOpen={showBuangConfirm} title='Buang' subTitle={`Menutup absensi ${absensi?.title} dan membuang perubahan absensi?`} onClose={() => setShowBuangConfirm(false)} callBack={buangAbsensi} textConfirm='Buang'/>
        <AbsensiEditor isOpen={openEdit} onClose={() => setOpenEdit(false)} callBack={editAbsensi} submitText='Simpan' title={absensi?.title} note={absensi?.note} coordinates={absensi?.coordinates || {}}/>
        <Modal isOpen={showUsers} onClose={() => setShowUsers(false)}>
            <div className="flex flex-col p-2">
                <div className='flex flex-wrap flex-col sm:flex-row'>
                    <p className='sm:w-2/6 font-semibold'>Judul</p>
                    <p>{absensi?.title}</p>
                </div>
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
            </div>
            {/* <UsersList users={absensi?.tickets} absenceData={item}/> */}
            <DisplayTableUsers/>
        </Modal>
    </div>
}