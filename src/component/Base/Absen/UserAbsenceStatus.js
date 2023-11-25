import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCheckDouble, faDoorClosed, faDoorOpen, faRotate, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { API, formatBeautyDate, formatTime, isUserWithinBounds } from "../../../utils"
import LoadingIcon from '../../utils/LoadingIcon'
import { setAbsensi, setStatus, toggleShowAbsenceForm } from '../../../redux/source'
import SubmitAbsenceForm from './SubmitAbsenceForm'

export default function UserAbsenceStatus() {
    const account = useSelector(state => state.source.account)
    const status = useSelector(state => state.source.status)

    const [isFetchLoading, setIsFetchLoading] = useState(false)

    const dispatch = useDispatch()

    const fetchStatus = useCallback(async () => {
        setIsFetchLoading(true)
        try {
            await axios.get(API + '/absen/status/' + account._id)
            .then(res => {
                dispatch(setStatus(res.data.status))
                dispatch(setAbsensi(res.data.absensi))
                setIsFetchLoading(false)
            })
            .catch(err => {
                setIsFetchLoading(false)
                console.log(err)
            })
        } catch (error) {
            console.log(error);
        }
    },[account, dispatch])

    useEffect(() => {
        if (!status && account) fetchStatus()
    },[account, fetchStatus, status])

    const absensi = useSelector(state => state.source.absensi)

    if (absensi === null) return <div>
        <button className='flex ml-auto items-center justify-center rounded text-neutral-100 bg-secondary p-2 shadow-lg shadow-primary/50 duration-200 ease-in-out active:scale-95' onClick={() => fetchStatus()}>{isFetchLoading ? <LoadingIcon/> : <><FontAwesomeIcon icon={faRotate} className='p-0.5 pr-2'/> Segarkan status absensi</>}</button>
    </div>

    return <>
        <StatusDate/>
        <StatusUser/>
        <StatusServer/>
        <SubmitAbsenceForm/>
    </>
}

function StatusDate() {
    const absensi = useSelector(state => state.source.absensi)

    return <div className='flex items-center gap-2 px-2'>
        <FontAwesomeIcon icon={absensi?.status ? faDoorOpen : faDoorClosed}/>
        {absensi?.status ?
            <p>{absensi?.title} dibuka sejak</p>
            :
            <p>Terakhir ditutup</p>
        }
        <span className='ml-auto'>{formatBeautyDate(absensi?.date)}</span>
    </div>
}

function StatusUser() {
    const status = useSelector(state => state.source.status)
    const showAbsenceForm = useSelector(state => state.source.showAbsenceForm)

    const dispatch = useDispatch()

    if (status?.absen === null) return null

    return <>    
    <div className='bg-secondary shadow-lg shadow-primary/50 text-neutral-100 rounded p-4 flex gap-2 items-center relative'>
        {status?.absen === true &&
        <>
            <FontAwesomeIcon icon={isUserWithinBounds(status?.koordinat) ? faCheckDouble : faCheck}/>
            <p>{isUserWithinBounds(status?.koordinat) ? 'Absen di area' : 'Absen diluar area'}</p>
            <span className='ml-auto'>{formatTime(status.waktuAbsen)}</span>
        </>
        }
        {status?.absen === false &&
        <div className='flex flex-col w-full'>
            <div className='flex items-center gap-2'>
                <FontAwesomeIcon icon={faXmark}/>
                <p>Tidak Absen</p>
            </div>
            <div className='flex flex-col'>
                <AbsenceCell prop={'Kode'} value={status.kode}/>
                <AbsenceCell prop={'Keterangan'} value={status.keterangan}/>
                <AbsenceCell prop={'Waktu Absen'} value={formatTime(status.waktuAbsen)}/>
            </div>
        </div>
        }
    </div>
    {status?.absen !== null && <span onClick={() => dispatch(toggleShowAbsenceForm())} className='duration-200 ease-in-out active:scale-95 text-primary text-right underline cursor-pointer text-secondary'>{showAbsenceForm ? 'Batal perbarui' : 'Perbarui absensi'}</span>}
    </>
}

function StatusServer() {
    const absensi = useSelector(state => state.source.absensi)
    const account = useSelector(state => state.source.account)
    const status = useSelector(state => state.source.status)

    const dispatch = useDispatch()
    const [fetchLoading, setIsFetchLoading] = useState(false)

    const fetchStatus = useCallback(async () => {
        setIsFetchLoading(true)
        try {
            await axios.get(API + '/absen/status/' + account._id)
            .then(res => {
                dispatch(setStatus(res.data.status))
                dispatch(setAbsensi(res.data.absensi))
                setIsFetchLoading(false)
            })
            .catch(err => {
                setIsFetchLoading(false)
                console.log(err)
            })
        } catch (error) {
            console.log(error);
        }
    },[account, dispatch])

    useEffect(() => {
        if (!status && account) fetchStatus()
    },[account, fetchStatus, status])

    if (absensi?.status === true) return

    return <div className='bg-neutral-300 shadow-lg shadow-primary/50 text-neutral-500 rounded-xl p-4 flex gap-2 items-center relative'>
        <p>Absensi belum dibuka</p>
        <button className='flex ml-auto items-center justify-center rounded text-neutral-100 bg-secondary p-2 shadow-lg shadow-primary/50 duration-200 ease-in-out active:scale-95' onClick={() => fetchStatus()}>{fetchLoading ? <LoadingIcon/> :<FontAwesomeIcon icon={faRotate} className='p-0.5'/>}</button>
    </div>
}

function AbsenceCell({prop, value}) {
    return <div className='flex flex-col sm:flex-row border-b-[1px] border-solid border-neutral-300 last:border-transparent py-2'>
        <p className='sm:w-2/6 font-medium'>{prop}</p>
        <p>{value}</p>
    </div>
}