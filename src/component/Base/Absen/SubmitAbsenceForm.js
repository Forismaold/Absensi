import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { blankToast, loadingToast } from "../../utils/myToast"
import axios from "axios"
import { API, isUserWithinBounds } from "../../../utils"
import LoadingIcon from '../../utils/LoadingIcon'
import { setStatus, toggleShowAbsenceForm } from '../../../redux/source'
import Modal from '../../utils/Modal'

export default function SubmitAbsenceForm() {
    const firstCoordinate = useSelector(state => state.coordinates.first)
    const secondCoordinate = useSelector(state => state.coordinates.second)
    const userCoordinate = useSelector(state => state.coordinates.user)

    const status = useSelector(state => state.source.status)
    const absensi = useSelector(state => state.source.absensi)
    const account = useSelector(state => state.source.account)
    const showAbsenceForm = useSelector(state => state.source.showAbsenceForm)

    const [showTidak, setShowTidak] = useState(true)
    const [showKirim, setShowKirim] = useState(true)
    const [showFormTidak, setShowFormTidak] = useState(false)

    const [kode, setKode] = useState('-')
    const [keterangan, setKeterangan] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [showforceNext, setShowForceNext] = useState(false)

    const dispatch = useDispatch()

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
                setShowForceNext(false)
                dispatch(toggleShowAbsenceForm(false))
                
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

        
        if (!inArea) {
            return setShowForceNext(true)
        }

        handleHadir()
    }
    const handleHadir = useCallback(async () => {
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
                promise.onSuccess(res.data.msg)
                setIsLoading(false)
                setShowForceNext(false)
                dispatch(toggleShowAbsenceForm(false))
            }).catch(err => {
                promise.onError(err.response.data.msg)
                throw new Error(err)
            })
        } catch (error) {
            setIsLoading(false)
            promise.onError('Server error')
        }
    }, [account._id, dispatch, firstCoordinate, secondCoordinate, userCoordinate])

    useEffect(() => {
        if ((status?.absen === null && absensi?.status === true) && isUserWithinBounds(userCoordinate) && userCoordinate) handleHadir()
    }, [absensi?.status, handleHadir, status?.absen, userCoordinate])

    if (showAbsenceForm || (status?.absen === null && absensi?.status === true)) return <div className='flex flex-col rounded-xl'>
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

    return null
}

function ForceNext({isOpen, onClose, callBack}) {
    const [unlockButton, setUnlockButton] = useState(false)

    function handleCheckbox(e) {
        setUnlockButton(e.target.checked)
    }

    function handleCallback() {
        if (!unlockButton) return
        callBack()
    }

    return <Modal isOpen={isOpen} onClose={onClose} zIndex={'z-[1001]'}>
        <div className='text-neutral-500 rounded-lg p-4 flex flex-col gap-2 shadow-lg shadow-primary/50'>
            <p>Anda diluar lokasi absen</p>
            <div className='flex gap-2 items-center'>
                <input type="checkbox" id='FNCB' className='checked:bg-primary shadow-lg shadow-primary/50 border-secondary rounded focus:ring-primary' onChange={handleCheckbox}/>
                <label htmlFor="FNCB" className='flex-1'>Tetap Lanjutkan mengirim di luar area</label>
            </div>
            <div onClick={handleCallback} className={`flex-1 ${!unlockButton ? 'bg-neutral-transparent' : 'bg-secondary shadow-lg shadow-secondary/50'} text-neutral-200 p-2 duration-200 ease-in-out active:scale-95 rounded flex justify-center shadow cursor-pointer hover:shadow-xl duration-300 hover:-translate-y-1`}>
                <span>Lanjutkan</span>
            </div>
        </div>
    </Modal>
}