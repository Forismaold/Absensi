import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCheckDouble, faDoorClosed, faDoorOpen, faRefresh, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { API, formatBeautyDate, formatTime, isUserWithinBounds } from "../../../utils"
import { toggleShowAbsenceForm } from '../../../redux/source'
import SubmitAbsenceForm from './SubmitAbsenceForm'
import { useParams } from 'react-router-dom'

export default function UserAbsenceStatus() {
    const account = useSelector(state => state.source.account)
    // const status = useSelector(state => state.source.status)
    const [absensi, setAbsensi] = useState(null)

    const [isFetchLoading, setIsFetchLoading] = useState(false)

    // const dispatch = useDispatch()
    const param = useParams()

    // const fetchStatus = useCallback(async () => {
    //     setIsFetchLoading(true)
    //     try {
    //         await axios.get(API + '/absen/status/' + account?._id)
    //         .then(res => {
    //             dispatch(setStatus(res.data.status))
    //             dispatch(setAbsensi(res.data.absensi))
    //             setIsFetchLoading(false)
    //         })
    //         .catch(err => {
    //             setIsFetchLoading(false)
    //             console.log(err)
    //         })
    //     } catch (error) {
    //         setIsFetchLoading(false)
    //         console.log(error);
    //     }
    // },[account, dispatch])

    // useEffect(() => {
    //     if (!status) fetchStatus()
    // },[account, fetchStatus, status])

    // const absensi = useSelector(state => state.source.absensi)

    const fetchData = useCallback(async () => {
        setIsFetchLoading(true)
        try {
            await axios.get(API + '/absensi/' + param.absenceId)
            .then(res => {
                console.log(res.data.data);
                setAbsensi(res.data.data)
            })
        } catch (error) {
            
        } finally {
            setIsFetchLoading(false)
        }
    },[param.absenceId])
    useEffect(() => {
        if (!absensi) fetchData()
    },[absensi, fetchData])

    // if (!absensi === null) return <div>
    //     <button className='flex ml-auto items-center justify-center rounded text-neutral-100 bg-secondary p-2 shadow-lg shadow-primary/50 click-animation' onClick={() => fetchStatus()}>{isFetchLoading ? <LoadingIcon/> : <><FontAwesomeIcon icon={faRotate} className='p-0.5 pr-2'/> Segarkan status absensi</>}</button>
    // </div>

    if (!absensi === null) return null

    return <>
        <div className='flex items-center justify-end' onClick={fetchData}>
            <div className='flex gap-2 items-center bg-secondary p-2 shadow-lg shadow-primary/50 click-animation rounded-lg text-neutral-100 cursor-pointer'>
                <FontAwesomeIcon icon={faRefresh} className={`${isFetchLoading && 'animate-spin'}`}/> Segarkan Absensi
            </div>
        </div>
        <StatusDate absensi={absensi}/>
        <StatusUser status={absensi?.users.find(item => item._id === account._id)}/> 
        {/* <StatusServer absensi={absensi}/> */}
        <SubmitAbsenceForm absensi={absensi} setAbsensi={setAbsensi}/>
    </>
}

function StatusDate({ absensi }) {
    if (!absensi) return null

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

function StatusUser({ status }) {
    const account = useSelector(state => state.source.account)
    const showAbsenceForm = useSelector(state => state.source.showAbsenceForm)

    const dispatch = useDispatch()

    if (!status|| !account) return null

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
    {status?.absen !== null && account && <span onClick={() => dispatch(toggleShowAbsenceForm())} className='click-animation text-primary text-right underline cursor-pointer text-secondary'>{showAbsenceForm ? 'Batal perbarui' : 'Perbarui absensi'}</span>}
    </>
}

// function StatusServer({ absensi }) {
//     const account = useSelector(state => state.source.account)
//     const status = useSelector(state => state.source.status)

//     const dispatch = useDispatch()
//     const [fetchLoading, setIsFetchLoading] = useState(false)

//     const fetchStatus = useCallback(async () => {
//         setIsFetchLoading(true)
//         try {
//             await axios.get(API + '/absen/status/' + account._id)
//             .then(res => {
//                 dispatch(setStatus(res.data.status))
//                 dispatch(setAbsensi(res.data.absensi))
//                 setIsFetchLoading(false)
//             })
//             .catch(err => {
//                 setIsFetchLoading(false)
//                 console.log(err)
//             })
//         } catch (error) {
//             setIsFetchLoading(false)
//             console.log(error);
//         }
//     },[account, dispatch])

//     useEffect(() => {
//         if (!status && account) fetchStatus()
//     },[account, fetchStatus, status])

//     if (absensi?.status === true) return

//     return <div className='bg-neutral-300 shadow-lg shadow-primary/50 text-neutral-500 rounded-xl p-4 flex gap-2 items-center relative'>
//         {!absensi ? <p>Periksa internet kamu</p> : <p>Absensi belum dibuka</p>}
//         <button className='flex ml-auto items-center justify-center rounded text-neutral-100 bg-secondary p-2 shadow-lg shadow-primary/50 click-animation' onClick={() => fetchStatus()}>{fetchLoading ? <LoadingIcon/> :<FontAwesomeIcon icon={faRotate} className='p-0.5'/>}</button>
//     </div>
// }

function AbsenceCell({prop, value}) {
    return <div className='flex flex-col sm:flex-row border-b-[1px] border-solid border-neutral-300 last:border-transparent py-2'>
        <p className='sm:w-2/6 font-medium'>{prop}</p>
        <p>{value}</p>
    </div>
}