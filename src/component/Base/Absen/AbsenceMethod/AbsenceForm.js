import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faQuestion } from '@fortawesome/free-solid-svg-icons'
import { useCallback, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { blankToast, loadingToast } from "../../../utils/myToast"
import axios from "axios"
import { API, isUserWithinBounds } from "../../../../utils"
import LoadingIcon from '../../../utils/LoadingIcon'
import { setAbsensi, setShowAbsence, setShowMap } from '../../../../redux/source'
import Modal from '../../../utils/Modal'
import { InfoManualSubmit } from '../InfoModals'

export default function AbsenceForm() {
    const userCoordinate = useSelector(state => state.coordinates.user)
    const absensi = useSelector(state => state.source.absensi)
    const status = useSelector(state => state.source.status)

    // const status = useSelector(state => state.source.status)
    // const absensi = useSelector(state => state.source.absensi)
    const account = useSelector(state => state.source.account)

    const [showTidak, setShowTidak] = useState(true)
    const [showKirim, setShowKirim] = useState(true)
    const [showFormTidak, setShowFormTidak] = useState(false)

    const [kode, setKode] = useState('-')
    const [keterangan, setKeterangan] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [showforceNext, setShowForceNext] = useState(false)

    const [showInfoManualSubmit, setShowInfoManualSubmit] = useState(false)

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
            status,
            kode,
            keterangan,
            userCoordinate,
        }
        const promise = loadingToast('Mengirim keterangan tidak hadir')
        setIsLoading(true)
        try {
            await axios.post(API + '/absen/tidakHadir/' + absensi?._id, dataToSend)
            .then(res => {
                promise.onSuccess(res.data.msg)
                handleTidakHadir()
                setIsLoading(false)
                setShowForceNext(false)
                dispatch(setAbsensi(res.data.data))
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
        const inArea = isUserWithinBounds(userCoordinate)
        if (!inArea) return setShowForceNext(true)

        handleHadir()
    }
    const handleHadir = useCallback(async () => {

        setShowForceNext(false)
        const dataToSend = {
            user: account._id,
            userCoordinate: userCoordinate ? userCoordinate : [0,0],
            status
        }

        const promise = loadingToast('Mengirim...')
        setIsLoading(true)

        if (!isUserWithinBounds(userCoordinate)) blankToast('Kamu berada diluar area, pengiriman tetap dilanjutkan')

        try {
            await axios.post(API + '/absen/hadir/' + absensi?._id, dataToSend)
            .then(res => {
                promise.onSuccess(res.data.msg)
                setIsLoading(false)
                dispatch(setShowAbsence(false))
                dispatch(setShowMap(false))
                dispatch(setAbsensi(res.data.data))
                console.log(res.data.data);
            }).catch(err => {
                promise.onError(err.response.data.msg)
                throw new Error(err)
            })
        } catch (error) {
            setIsLoading(false)
            promise.onError('Server error')
        }
    }, [absensi, account, dispatch, userCoordinate, status])

    if (!account || !absensi) return
    // if (showAbsenceForm || (status === undefined && absensi?.status === true))
    return <div className='flex flex-col rounded-xl'>
        <div className='bg-neutral-200 rounded-xl p-2 flex flex-col gap-2 shadow-lg shadow-primary/50'>
            <div className='flex gap-2 items-center justify-between'>
                <p>Kirim form sebagai {account?.panggilan || account?.nama}</p>
                <button className='flex items-center justify-center px-3 text-neutral-500 p-2 click-animation' onClick={() => setShowInfoManualSubmit(true)}><FontAwesomeIcon icon={faQuestion}/></button>
            </div>
            
            <div className='flex gap-2 bg-secondary text-neutral-100 p-2 rounded-md'>
                {showTidak &&
                    <div className='border-2 border-solid border-neutral-200 bg-inherit text-neutral-200 px-3 rounded flex justify-center items-center shadow cursor-pointer' onClick={handleTidakHadir}>
                        <FontAwesomeIcon icon={faChevronRight}/>
                    </div>
                }
                {showFormTidak &&
                    <form className='flex flex-col gap-2 w-full' onSubmit={handleSubmitTidakHadir}>
                        <div className='flex flex-col sm:flex-row gap-2 flex-1'>
                            <select value={kode} onChange={(e) => setKode(e.target.value)} className='min-h-[40px] px-2 rounded bg-primary border-2 border-solid border-neutral-200 shadow' placeholder='Kode keterangan'>
                                <option value="-" disable='true'>Kode</option>
                                <option value="I">Izin</option>
                                <option value="S">Sakit</option>
                                <option value="A">Alpa</option>
                            </select>
                            <textarea value={keterangan} onChange={(e) => setKeterangan(e.target.value)} className='border-2 border-solid border-neutral-200 bg-primary p-2 flex-[5] rounded placeholder:text-neutral-300 shadow' placeholder='Tambahkan keterangan'></textarea>
                        </div>
                        <div className='flex gap-2'>
                            <div className='border-2 border-solid border-neutral-200 bg-inherit text-neutral-200 px-3 rounded flex justify-center items-center shadow cursor-pointer' onClick={handleTidakHadir}>
                                <FontAwesomeIcon icon={faChevronLeft}/>
                            </div>
                            <button className={`flex-1 ${isLoading ? 'bg-neutral-transparent' : 'bg-neutral-200 shadow-lg shadow-neutral-300/10'} click-animation text-secondary p-2 rounded flex justify-center shadow cursor-pointer hover:shadow-xl duration-300 hover:-translate-y-1`}>
                                {isLoading ? <LoadingIcon/> : <span>Kirim tidak hadir</span>}
                            </button>
                        </div>
                    </form>
                }
                {showKirim &&
                    <div className={`flex-1 ${isLoading ? 'bg-neutral-transparent' : 'bg-neutral-200 shadow-lg shadow-neutral-300/10'} text-secondary p-2 click-animation rounded flex justify-center shadow cursor-pointer hover:shadow-xl duration-300 hover:-translate-y-1`} onClick={handleButtonHadir}>
                        {isLoading ? <LoadingIcon/> : <span>Kirim</span>}
                    </div>
                }
                <ForceNext isOpen={showforceNext} onClose={() => setShowForceNext(false)} callBack={handleHadir}/>
            </div>
        </div>
        <InfoManualSubmit isOpen={showInfoManualSubmit} onClose={() => setShowInfoManualSubmit(false)}/>
    </div>
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
            <div onClick={handleCallback} className={`flex-1 ${!unlockButton ? 'bg-neutral-transparent' : 'bg-secondary shadow-lg shadow-secondary/50'} text-neutral-200 p-2 click-animation rounded flex justify-center shadow cursor-pointer hover:shadow-xl duration-300 hover:-translate-y-1`}>
                <span>Lanjutkan</span>
            </div>
        </div>
    </Modal>
}