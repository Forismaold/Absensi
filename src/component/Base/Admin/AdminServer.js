import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClockRotateLeft, faPlus, faRefresh, faSearch, faServer, faUserGroup, faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { useSelector } from "react-redux"
import { getPermission } from "../../../utils"
import axios from '../../utils/axios'
import { loadingToast } from '../../utils/myToast'
import { useCallback, useEffect, useState } from 'react'
import { Link, Route, Routes, useNavigate, useSearchParams } from 'react-router-dom'
import LoadingSkeleton from '../../utils/LoadingSkeleton'
import AbsensiEditor from './AbsensiEditor'
// import DisplayTableUsers from './DisplayTableUsers'
import TombolAksiAbsensi from './TombolAksiAbsensi'
// import QRCode from 'react-qr-code'

export default function AdminServer() {
    const [permission, setPermission] = useState(false)

    useEffect(() => {
        setPermission(getPermission())
    }, [])

    if (!permission) return <div>
        <p>Anda bukan pengelola!</p>
    </div>

    return <div className='flex flex-col gap-2'>
        
        <Routes>
            <Route path='/' element={<>
                <div className='flex items-center rounded shadow overflow-auto'>
                    <Link to={'/admin/server'} className='flex flex-1 px-4 items-center py-2 gap-2 click-animation border-b-2 border-secondary text-secondary bg-quaternary'>
                        <FontAwesomeIcon icon={faServer}/> Server
                    </Link>
                    <Link to={'/admin/riwayat'} className='flex flex-1 px-4 items-center py-2 gap-2 click-animation border-b-2 border-transparent text-neutral-500 bg-neutral-200'>
                        <FontAwesomeIcon icon={faClockRotateLeft}/> Riwayat
                    </Link>
                    <Link to={'/admin/users'} className='flex flex-1 px-4 items-center py-2 gap-2 click-animation border-b-2 border-transparent  text-neutral-500 bg-neutral-200'>
                        <FontAwesomeIcon icon={faUserGroup}/> User
                    </Link>
                </div>
                <ManageAbsence/>
            </>}/>
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
            await axios.get( '/absensi/detail/' + searchParams.get('q'))
            .then(res => {
                setIsLoading(false)
                setAbsensi(res.data.data)
                console.log(res.data.data)
            }).catch(err => {
                throw new Error(err)
            })
        } catch (error) {
            console.log('why error?', error)
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
        <TombolAksiAbsensi item={absensi}/>
        {/* <div className={`flex gap-2 shadow-lg ${absensi?.status ? 'bg-secondary-200 border-neutral-200 text-neutral-200' : 'bg-neutral-200 border-secondary text-secondary'} shadow-secondary/50 cursor-pointer  items-center p-2 rounded  border-2 border-solid click-animation`} onClick={() => setShowSaveConfirm(true)}>
            <FontAwesomeIcon icon={faFloppyDisk}/>
            <p>Simpan</p>
        </div> */}
        {/* <div onClick={() => absensi?.status ? handleAbsensi('tutup'):handleAbsensi('buka')} className={`flex flex-1 justify-center gap-2 shadow-lg ${absensi?.status ? 'bg-neutral-200  text-secondary' : 'bg-secondary text-neutral-200'} shadow-secondary/50 cursor-pointer items-center p-2 rounded click-animation`}>
            <FontAwesomeIcon icon={absensi?.status ? faDoorClosed : faBoxOpen}/>
            <p>{absensi?.status ? 'Tutup' : 'Buka'}</p>
        </div> */}
    </div>
}

function ManageAbsence() {
    const [show, setShow] = useState(false)
    const account = useSelector(state => state.source.account)
    const [isLoading, setIsLoading] = useState(false)
    const [fetchError, setFetchError] = useState(false)
    const [absenceList, setAbsenceList] = useState(null)
    const [openCreateAbsence, setOpenCreateAbsence] = useState(false)

    const navigate = useNavigate()

    const fetchAbsence = useCallback(async () => {
        setIsLoading(true)
        setFetchError(false)
        try {
            await axios.get( '/absensi').then(res => {
                setAbsenceList(res.data.data)
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
            await axios.get( '/absensi', {
                title,
                note,
                coordinates,
                openedBy: account?.panggilan || account.nama,
                allowedGrades: openCreateAbsence || ''
            }).then(res => {
                promise.onSuccess('berhasil menambahkan absensi')
                setOpenCreateAbsence(false)
                setAbsenceList(res.data.list)
                console.log(res.data.createdAbsence?._id)
                navigate(`/admin/server/detail?q=${res.data.createdAbsence?._id}`)
                console.log(res.data)
            }).catch(err => {
                throw new Error(err)
            })
        } catch (error) {
            promise.onError('Gagal menambahkan absensi')
        }
    }

    useEffect(() => {
        if (!absenceList) fetchAbsence()
    },[absenceList, fetchAbsence])

    return <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-end' onClick={fetchAbsence}>
            <div className='flex gap-2 items-center bg-secondary p-2 shadow-lg shadow-primary/50 click-animation rounded-lg text-neutral-100 cursor-pointer'>
                <FontAwesomeIcon icon={faRefresh} className={`${isLoading && 'animate-spin'}`}/> Segarkan
            </div>
        </div>
        {fetchError && <span>Gagal mendapatkan data!</span>}
        {isLoading ? <LoadingSkeleton/> : <div>
            <AccordionGrades setOpenCreateAbsence={setOpenCreateAbsence} show={show} setShow={setShow} list={absenceList} grade='X.E' setAbsenceList={setAbsenceList}/>
            <AccordionGrades setOpenCreateAbsence={setOpenCreateAbsence} show={show} setShow={setShow} list={absenceList} grade='XI.F' setAbsenceList={setAbsenceList}/>
            <AccordionGrades setOpenCreateAbsence={setOpenCreateAbsence} show={show} setShow={setShow} list={absenceList} grade='XII.F' setAbsenceList={setAbsenceList}/>
        </div>}
        {absenceList?.filter(Boolean)?.length === 0 && <span className='text-center'>Tidak ada absensi</span>}
        {/* <div className='flex items-center justify-end' onClick={() => setOpenCreateAbsence(true)}>
            <div className='flex items-center bg-primary p-2 shadow-lg shadow-primary/50 click-animation rounded-lg text-neutral-100 cursor-pointer'>
                <FontAwesomeIcon icon={faPlus}/> Baru
            </div>
        </div> */}
        <AbsensiEditor isOpen={openCreateAbsence} onClose={() => setOpenCreateAbsence(null)} callBack={createAbsence}/>
    </div>
}

function AccordionGrades({grade = '', list = [], show = false, setShow, setOpenCreateAbsence, setAbsenceList}) {
    return <div className='flex flex-col shadow p-2 rounded'>
        <div className='flex gap-2 items-center cursor-pointer'>
            <h3 onClick={() => setShow(show === grade ? false : grade)} className='font-semibold text-3xl p-2 flex-1 flex items-center gap-2'><span className="flex-1">{grade}</span> <FontAwesomeIcon className='text-2xl' icon={show === grade ? faChevronDown : faChevronRight}/></h3>
            <div className="flex gap-2 items-center bg-secondary p-2 shadow-lg shadow-primary/50 click-animation rounded-lg text-neutral-100 cursor-pointer" onClick={() => {
                    setOpenCreateAbsence(grade)
                }}>
                <FontAwesomeIcon className='text-2xl' icon={faPlus}/>
                {list?.filter(i => i.allowedGrades.find(x => x === grade)).length > 0 && <span>({list?.filter(i => i.allowedGrades.find(x => x === grade)).length || 0})</span>}
            </div>
        </div>
        <div className={`grid transition-all duration-300 ease-in-out overflow-hidden 
            ${show === grade ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}
            `}>
            {/* <div className='overflow-hidden flex flex-col gap-2'> */}
            <div className='overflow-hidden grid gap-2 grid-cols-1 sm:grid-cols-2'>
                {list?.filter(i => i.allowedGrades.find(x => x === grade)).map(item => <TombolAksiAbsensi item={item} key={item._id} callbackList={setAbsenceList} lite={true}/>) || []}
            </div>
        </div>
    </div>
}