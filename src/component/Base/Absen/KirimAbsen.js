import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faChevronLeft, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { blankToast, loadingToast } from "../../utils/myToast"
import axios from "axios"
import { API, formatTime } from "../../../utils"
import LoadingIcon from '../../utils/LoadingIcon'
import { setStatus } from '../../../redux/source'


export default function KirimAbsen() {
    const firstCoordinate = useSelector(state => state.coordinates.first)
    const secondCoordinate = useSelector(state => state.coordinates.second)
    const userCoordinate = useSelector(state => state.coordinates.user)
    const account = useSelector(state => state.source.account)
    const status = useSelector(state => state.source.status)

    const [kode, setKode] = useState('-')
    const [keterangan, setKeterangan] = useState('')
    const [showTidak, setShowTidak] = useState(true)
    const [showKirim, setShowKirim] = useState(true)
    const [showFormTidak, setShowFormTidak] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const dispatch = useDispatch(status)

    const fetchStatus = useCallback(() => {
        try {
            axios.get(API + '/absen/status/' + account._id)
            .then(res => {
                console.log(res.data);
                dispatch(setStatus(res.data))
            })
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
            keterangan
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

    async function handleHadir() {
        const dataToSend = {
            _id: account._id,
        }

        if (!userCoordinate) return blankToast('Koordinat kamu belum ditetapkan')

        const isUserWithinBounds = (userCoordinate[0] >= firstCoordinate[0] && userCoordinate[0] <= secondCoordinate[0]) &&(userCoordinate[1] >= firstCoordinate[1] && userCoordinate[1] <= secondCoordinate[1])

        if (!isUserWithinBounds) blankToast('Kamu berada diluar area, pengiriman tetap dilanjutkan')

        const promise = loadingToast('Mengirim...')
        setIsLoading(true)
        try {
            await axios.post(API + '/absen/hadir', dataToSend)
            .then(res => {
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

    if (status?.absen === null) return <div className='bg-indigo-600 text-neutral-100 rounded-xl p-4 flex flex-col gap-2'>
        <p>Kirim sebagai {account?.panggilan || account?.nama}</p>
        <div className='flex sm:flex-row flex-col gap-2'>
            {showTidak &&
                <div className='flex-1 border-2 border-solid border-neutral-200 bg-inherit text-neutral-200 p-2 rounded flex justify-center shadow cursor-pointer' onClick={handleTidakHadir}>
                    <span>Tidak</span>
                </div>
            }
            {showFormTidak &&
                <form className='flex flex-col gap-2 w-full' onSubmit={handleSubmitTidakHadir}>
                    <div className='flex items-center gap-2 bg-indigo-500 rounded p-2 shadow cursor-pointer' onClick={handleTidakHadir}>
                        <FontAwesomeIcon icon={faChevronLeft}/>
                        <p>Tidak hadir</p>
                    </div>
                    <div className='flex flex-col sm:flex-row gap-2 flex-1'>
                        <select value={kode} onChange={(e) => setKode(e.target.value)} className='min-h-[40px] shadow px-2 rounded bg-indigo-600 border-2 border-solid border-neutral-200 shadow' placeholder='Kode keterangan'>
                            <option value="-" disable='true'>Kode</option>
                            <option value="I">Izin</option>
                            <option value="S">Sakit</option>
                            <option value="A">Alpa</option>
                        </select>
                        <textarea value={keterangan} onChange={(e) => setKeterangan(e.target.value)} className='shadow border-2 border-solid border-neutral-200 bg-indigo-600 p-2 flex-[5] rounded placeholder:text-neutral-300 shadow' placeholder='Tambahkan keterangan'></textarea>
                    </div>
                    <button type='submit' className='flex justify-center rounded bg-indigo-600 border-2 border-solid border-neutral-200 p-2 hover:text-indigo-700 hover:bg-neutral-200'>{isLoading ? <LoadingIcon/> : 'Kirim'}</button>
                </form>
            }
            {showKirim &&
                <div className={`flex-[4] ${isLoading ? 'bg-neutral-transparent' : 'bg-neutral-200'} text-indigo-600 p-2 rounded flex justify-center shadow cursor-pointer hover:shadow-xl duration-300 hover:-translate-y-1`} onClick={handleHadir}>
                    {isLoading ? <LoadingIcon/> : <span>Kirim</span>}
                </div>
            }
        </div>
    </div>

    return <div className='bg-indigo-600 text-neutral-100 rounded-xl p-4 flex gap-2 items-center'>
        {status?.absen === true &&
        <>
            <FontAwesomeIcon icon={faCheck}/>
            <p>Sudah Absen</p>
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
}

function AbsenceCell({prop, value}) {
    return <div className='flex flex-col sm:flex-row border-b-[1px] border-solid border-neutral-400 last:border-transparent py-2'>
        <p className='sm:w-2/6 font-medium'>{prop}</p>
        <p>{value}</p>
    </div>
}