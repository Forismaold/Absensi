import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faChevronLeft, faChevronRight, faDoorClosed, faDoorOpen, faRotate, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { blankToast, loadingToast } from "../../utils/myToast"
import axios from "axios"
import { API, formatDate, formatTime } from "../../../utils"
import LoadingIcon from '../../utils/LoadingIcon'
import { setAbsensi, setStatus } from '../../../redux/source'
import Modal from '../../utils/Modal'

export default function KirimAbsen() {
    const firstCoordinate = useSelector(state => state.coordinates.first)
    const secondCoordinate = useSelector(state => state.coordinates.second)
    const userCoordinate = useSelector(state => state.coordinates.user)
    const account = useSelector(state => state.source.account)
    const status = useSelector(state => state.source.status)
    const absensi = useSelector(state => state.source.absensi)

    const [kode, setKode] = useState('-')
    const [keterangan, setKeterangan] = useState('')
    const [showTidak, setShowTidak] = useState(true)
    const [showKirim, setShowKirim] = useState(true)
    const [showFormTidak, setShowFormTidak] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [showforceNext, setShowForceNext] = useState(false)

    const dispatch = useDispatch(status)

    const fetchStatus = useCallback(() => {
        try {
            axios.get(API + '/absen/status/' + account._id)
            .then(res => {
                dispatch(setStatus(res.data.status))
                dispatch(setAbsensi(res.data.absensi))
            })
            .catch(err => console.log(err))
        } catch (error) {
            
        }
    },[account, dispatch])

    useEffect(() => {
        if (!status && account) fetchStatus()
    },[account, fetchStatus, status])

    if (!account) return null

    function handleTidakHadir() {
        setShowKirim(prev => !prev)
        setShowTidak(prev => !prev)
        setShowFormTidak(prev => !prev)
    }

    async function handleSubmitTidakHadir(e) {
        e.preventDefault()
        const dataToSend = {
            _id: account._id,
            kode,
            keterangan,
            userCoordinate
        }
        const promise = loadingToast('Mengirim keterangan tidak hadir')
        setIsLoading(true)
        try {
            await axios.post(API + '/absen/tidakHadir', dataToSend)
            .then(res => {
                promise.onSuccess(res.data.msg)
                handleTidakHadir()
                setIsLoading(false)
                dispatch(setStatus(res.data.status))
            }).catch(err => {
                setIsLoading(false)
                promise.onError(err.response.data.msg)
            })
        } catch (error) {
            setIsLoading(false)
            promise.onError('Server error')
        }
    }

    async function handleButtonHadir() {
        if (!userCoordinate) return blankToast('Koordinat kamu belum ditetapkan')

        const inArea = (userCoordinate[0] >= firstCoordinate[0] && userCoordinate[0] <= secondCoordinate[0]) && (userCoordinate[1] >= firstCoordinate[1] && userCoordinate[1] <= secondCoordinate[1])

        
        // if (!inArea) return blankToast('Kamu berada diluar area, pengiriman tidak dapat dilanjutkan')
        if (!inArea) {
            console.log(!inArea);
            return setShowForceNext(true)
        }

        handleHadir()
    }
    async function handleHadir() {
        const dataToSend = {
            _id: account._id,
            userCoordinate
        }

        if (!userCoordinate) return blankToast('Koordinat kamu belum ditetapkan')

        if (!(userCoordinate[0] >= firstCoordinate[0] && userCoordinate[0] <= secondCoordinate[0]) &&(userCoordinate[1] >= firstCoordinate[1] && userCoordinate[1] <= secondCoordinate[1])) blankToast('Kamu berada diluar area, pengiriman tetap dilanjutkan')

        const promise = loadingToast('Mengirim...')
        setIsLoading(true)
        try {
            await axios.post(API + '/absen/hadir', dataToSend)
            .then(res => {
                dispatch(setStatus(res.data.status))
                console.log(res.data.status)
                promise.onSuccess(res.data.msg)
                setIsLoading(false)
            }).catch(err => {
                promise.onError(err.response.data.msg)
                throw new Error(err)
            })
        } catch (error) {
            setIsLoading(false)
            promise.onError('Server error')
        }
    }

    if (!absensi?.status && absensi !== null) return <div className='bg-neutral-300 shadow-lg shadow-primary/50 text-neutral-500 rounded-xl p-4 flex gap-2 items-center relative'>
        <FontAwesomeIcon icon={faDoorClosed}/>
        <p>Absensi belum dibuka</p>
        <button className='flex ml-auto items-center self-end justify-center rounded text-neutral-100 bg-secondary p-2 shadow-lg shadow-primary/50 duration-200 ease-in-out active:scale-95' onClick={() => fetchStatus()}><FontAwesomeIcon icon={faRotate}/></button>
    </div>

    if (status?.absen === null) return <div className='flex flex-col rounded-xl'>
        <div className='flex items-center gap-2 px-2'>
            <FontAwesomeIcon icon={faDoorOpen}/>
            <p>Absensi dibuka sejak</p>
            <span className='ml-auto'>{formatDate(absensi?.date)}</span>
        </div>
        <div className='bg-secondary text-neutral-100 rounded-xl p-4 flex flex-col gap-2 shadow-lg shadow-primary/50'>
            <p>Kirim sebagai {account?.panggilan || account?.nama}</p>
            <div className='flex gap-2'>
                {showTidak &&
                    <div className='border-2 border-solid border-neutral-200 bg-inherit text-neutral-200 px-3 rounded flex justify-center items-center shadow cursor-pointer' onClick={handleTidakHadir}>
                        <FontAwesomeIcon icon={faChevronRight}/>
                    </div>
                }
                {showFormTidak &&
                    <form className='flex flex-col gap-2 w-full' onSubmit={handleSubmitTidakHadir}>
                        <div className='flex items-center rounded shadow-md mt-2 p-2'>
                            <p>Tidak hadir</p>
                        </div>
                        <div className='flex flex-col sm:flex-row gap-2 flex-1'>
                            <select value={kode} onChange={(e) => setKode(e.target.value)} className='min-h-[40px] shadow px-2 rounded bg-primary border-2 border-solid border-neutral-200 shadow' placeholder='Kode keterangan'>
                                <option value="-" disable='true'>Kode</option>
                                <option value="I">Izin</option>
                                <option value="S">Sakit</option>
                                <option value="A">Alpa</option>
                            </select>
                            <textarea value={keterangan} onChange={(e) => setKeterangan(e.target.value)} className='shadow border-2 border-solid border-neutral-200 bg-primary p-2 flex-[5] rounded placeholder:text-neutral-300 shadow' placeholder='Tambahkan keterangan'></textarea>
                        </div>
                        <div className='flex gap-2'>
                            <div className='border-2 border-solid border-neutral-200 bg-inherit text-neutral-200 px-3 rounded flex justify-center items-center shadow cursor-pointer' onClick={handleTidakHadir}>
                                <FontAwesomeIcon icon={faChevronLeft}/>
                            </div>
                            <button className={`flex-1 ${isLoading ? 'bg-neutral-transparent' : 'bg-neutral-200 shadow-lg shadow-neutral-300/10'} duration-200 ease-in-out active:scale-95 text-secondary p-2 rounded flex justify-center shadow cursor-pointer hover:shadow-xl duration-300 hover:-translate-y-1`}>
                                {isLoading ? <LoadingIcon/> : <span>Kirim tidak absen</span>}
                            </button>
                        </div>
                    </form>
                }
                {showKirim &&
                    <div className={`flex-1 ${isLoading ? 'bg-neutral-transparent' : 'bg-neutral-200 shadow-lg shadow-neutral-300/10'} text-secondary p-2 duration-200 ease-in-out active:scale-95 rounded flex justify-center shadow cursor-pointer hover:shadow-xl duration-300 hover:-translate-y-1`} onClick={handleButtonHadir}>
                        {isLoading ? <LoadingIcon/> : <span>Kirim</span>}
                    </div>
                }
                {showforceNext && <ForceNext isOpen={showforceNext} onClose={() => setShowForceNext(false)} callBack={handleHadir}/>}
            </div>
        </div>
    </div>

    return <div className="flex flex-col bg-neutral-300/50 rounded-xl p-2 gap-2">
        <button className='flex items-center self-end justify-center rounded text-neutral-100 bg-secondary p-2 shadow-lg shadow-primary/50 duration-200 ease-in-out active:scale-95' onClick={() => fetchStatus()}><FontAwesomeIcon icon={faRotate}/></button>
        <div className='bg-secondary shadow-lg shadow-primary/50 text-neutral-100 rounded-xl p-4 flex gap-2 items-center relative'>
            {status?.absen === true &&
            <>
                <FontAwesomeIcon icon={faCheck}/>
                <p>Sudah Absen</p>
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
    </div>
}

function AbsenceCell({prop, value}) {
    return <div className='flex flex-col sm:flex-row border-b-[1px] border-solid border-neutral-300 last:border-transparent py-2'>
        <p className='sm:w-2/6 font-medium'>{prop}</p>
        <p>{value}</p>
    </div>
}

function ForceNext({isOpen, onClose, callBack}) {
    const [unlockButton, setUnlockButton] = useState(false)

    function handleCheckbox(e) {
        console.log(e.target.checked)
        setUnlockButton(e.target.checked)
    }

    function handleCallback() {
        if (!unlockButton) return
        callBack()
    }

    return <Modal isOpen={isOpen} onClose={onClose} className={'z-[1001]'}>
        <div className='text-neutral-500 rounded-lg p-4 flex flex-col gap-2 shadow-lg shadow-primary/50'>
            <p>Anda diluar lokasi absen</p>
            <div className='flex gap-2 items-center'>
                <input type="checkbox" id='FNCB' className='checked:bg-primary shadow-lg shadow-primary/50 border-secondary rounded focus:ring-primary' onChange={handleCheckbox}/>
                <label htmlFor="FNCB" className='flex-1'>Tetap Lanjutkan mengirim diluar area</label>
            </div>
            <div onClick={handleCallback} className={`flex-1 ${!unlockButton ? 'bg-neutral-transparent' : 'bg-secondary shadow-lg shadow-secondary/50'} text-neutral-200 p-2 duration-200 ease-in-out active:scale-95 rounded flex justify-center shadow cursor-pointer hover:shadow-xl duration-300 hover:-translate-y-1`}>
                <span>Lanjutkan</span>
            </div>
        </div>
    </Modal>
}