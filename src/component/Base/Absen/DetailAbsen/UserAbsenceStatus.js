import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCheckDouble, faRefresh, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { API, formatTime, isUserWithinBounds } from "../../../../utils"
import { setAbsensi, toggleShowAbsence } from '../../../../redux/source'
import { useParams } from 'react-router-dom'
import Note from '../Note'
import AbsenceMethod from '../AbsenceMethod/AbsenceMethod'
import Modal from '../../../utils/Modal'

export default function UserAbsenceStatus() {
    const account = useSelector(state => state.source.account)
    // const status = useSelector(state => state.source.status)
    // const [absensi, setAbsensi] = useState(null)
    const absensi = useSelector(state => state.source.absensi)

    const [isFetchLoading, setIsFetchLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    // const dispatch = useDispatch()
    const param = useParams()
    const dispatch = useDispatch()

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
                dispatch(setAbsensi(res.data.data))
                console.log(res.data.data);
            }).catch(err => {
                setErrorMsg(err.response.data.msg)
            })
        } catch (error) {
            
        } finally {
            setIsFetchLoading(false)
        }
    },[dispatch, param.absenceId])
    useEffect(() => {
        setErrorMsg('')
    },[absensi])
    useEffect(() => {
        
        if (!absensi) fetchData()
    },[absensi, fetchData])

    useEffect(() => {
        if (absensi && absensi?._id !== param.absenceId) {
            dispatch(setAbsensi(null))
        }
    }, [absensi, dispatch, param.absenceId])
    

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
        <Note absensi={absensi}/>
        <StatusUser status={absensi?.users?.find(item => item._id === account?._id)}/> 
        <StatusAbsensi absensi={absensi} msg={errorMsg}/>
        <AbsenceMethod/>
        {/* <SubmitAbsenceForm absensi={absensi} setAbsensi={setAbsensi} status={absensi?.users?.find(item => item._id === account?._id) || undefined}/> */}
        {/* <UserAbsenceLocation /> */}
    </>
}

function StatusUser({ status }) {
    const account = useSelector(state => state.source.account)
    const showAbsenceForm = useSelector(state => state.source.showAbsenceForm)
    const [showAbsenceDetail, setShowAbsenceDetail] = useState(false)

    const dispatch = useDispatch()

    if (!status|| !account) return null

    return <>    
    <div className='bg-secondary shadow-lg shadow-primary/50 text-neutral-100 rounded p-4 flex gap-2 items-center relative click-animation' onClick={() => setShowAbsenceDetail(true)}>
        {status?.absen === true &&
            <div className='flex gap-2 items-center w-full'>
                <FontAwesomeIcon icon={isUserWithinBounds(status?.koordinat) ? faCheckDouble : faCheck}/>
                <p>{isUserWithinBounds(status?.koordinat) ? 'Absen di area' : 'Absen diluar area'}</p>
                <span className='ml-auto'>{formatTime(status.waktuAbsen)}</span>
            </div>
        }
        {status?.absen === false &&
            <div className='flex flex-col w-full'>
                <div className='flex items-center gap-2'>
                    <FontAwesomeIcon icon={faXmark}/>
                    <p>Tidak Absen</p>
                </div>
            </div>
        }
    </div>
    {status?.absen !== null && account && <span onClick={() => dispatch(toggleShowAbsence())} className='click-animation text-primary text-right underline cursor-pointer text-secondary'>{showAbsenceForm ? 'Batal perbarui' : 'Perbarui absensi'}</span>}
    <DetailUserAbsence isOpen={showAbsenceDetail} onClose={() => setShowAbsenceDetail(false)} status={status}/>
    </>
}

function DetailUserAbsence({isOpen, onClose, status}) {
    const account = useSelector(state => state.source.account)
    useEffect(() => {
        console.log(account);
    },[account])
    return <Modal isOpen={isOpen} onClose={onClose} zIndex={'z-[1001]'}>
        <div className='flex gap-2 items-center p-2'>
            <FontAwesomeIcon icon={isUserWithinBounds(status?.koordinat) ? faCheckDouble : faCheck} className='p-2'/>
            <div className='flex flex-col'>
                <p>{account?.nama}</p>
                <p>{account?.kelas}{account?.nomorKelas}/{account?.nomorAbsen}</p>
            </div>
        </div>
        <div className='flex flex-col gap-2 bg-secondary shadow-lg shadow-primary/50 text-neutral-100 p-2 rounded'>
            {status?.absen === true &&
            <div className='flex flex-col w-full gap-2'>
                <div className='flex flex-col'>
                    <AbsenceCell prop={'Koordinat'} value={`${status?.koordinat[0] || 0}, ${status?.koordinat[1] || 0}`}/>
                    <AbsenceCell prop={'Keterangan'} value={isUserWithinBounds(status?.koordinat) ? 'Absen di area' : 'Absen diluar area'}/>
                    <AbsenceCell prop={'Waktu Absen'} value={formatTime(status.waktuAbsen)}/>
                </div>
            </div>
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
    </Modal>
}

function StatusAbsensi({ absensi, msg }) {
    // const account = useSelector(state => state.source.account)
    // const status = useSelector(state => state.source.status)

    // const dispatch = useDispatch()
    // const [fetchLoading, setIsFetchLoading] = useState(false)

    // const fetchStatus = useCallback(async () => {
    //     setIsFetchLoading(true)
    //     try {
    //         await axios.get(API + '/absen/status/' + account._id)
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
    //     if (!status && account) fetchStatus()
    // },[account, fetchStatus, status])

    if (absensi?.status) return

    if (absensi?.status === false) return <div className='bg-neutral-300 shadow-lg shadow-primary/50 text-neutral-500 rounded-xl p-4 flex gap-2 items-center relative'>
        <p>Absensi {absensi?.title} belum ditutup</p>
    </div>

    return <div className='bg-neutral-300 shadow-lg shadow-primary/50 text-neutral-500 rounded-xl p-4 flex gap-2 items-center relative'>
        {!absensi && <p>{msg}</p>}
    </div>
}

function AbsenceCell({prop, value}) {
    return <div className='flex flex-col sm:flex-row border-b-[1px] border-solid border-neutral-300 last:border-transparent py-2'>
        <p className='sm:w-2/6 font-medium'>{prop}</p>
        <p>{value}</p>
    </div>
}