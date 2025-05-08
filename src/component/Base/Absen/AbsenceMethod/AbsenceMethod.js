import { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfo, faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { isUserWithinBounds } from "../../../../utils";
import { useDispatch, useSelector } from "react-redux";
import { blankToast, loadingToast } from "../../../utils/myToast";
import axios from "../../../utils/axios";
import { setAbsensi, setIsWatchPosition, setShowMap } from "../../../../redux/source";
import AbsenceForm, { AbsenceStandar, AbsenceWatch } from "./AbsenceList";
import { InfoAutoSubmit, InfoCommonProblem, InfoManualSubmit, InfoScanSubmit } from "../InfoModals";
import Modal from "../../../utils/Modal";
import { setUserCoordinate } from "../../../../redux/coordinates";

export default function AbsenceMethod() {
    const account = useSelector(state => state.source.account)
    // const proMode = useSelector(state => state.source.proMode)
    const userCoordinate = useSelector(state => state.coordinates.user)
    const absensi = useSelector(state => state.source.absensi)
    const status = useSelector(state => state.source.status)
    // const showAbsence = useSelector(state => state.source.showAbsence)

    const [showCommonProblem, setShowCommonProblem] = useState(false)
    const [watchInfo, setwatchInfo] = useState(false)
    const [formInfo, setFormInfo] = useState(false)
    const [scanInfo, setScanInfo] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [openListMethod, setOpenListMethod] = useState(false)
    const [methodSelected, setMethodSelected] = useState('GPS Watch (Boosted)')

    const dispatch = useDispatch()

    const handleHadir = useCallback(async () => {

        const dataToSend = {
            user: account?._id,
            userCoordinate: userCoordinate ? userCoordinate : [0,0],
        }

        const promise = loadingToast('Mengirim...')
        setIsLoading(true)

        if (!isUserWithinBounds(userCoordinate)) blankToast('Kamu berada diluar area, pengiriman tetap dilanjutkan')

        try {
            await axios.post('/absen/hadir/' + absensi?._id, dataToSend)
            .then(res => {
                promise.onSuccess(res?.data?.msg)
                // dispatch(setShowAbsence(false))
                dispatch(setShowMap(false))
                dispatch(setUserCoordinate(null))
                dispatch(setAbsensi(res?.data?.data))
                setIsLoading(false)
            }).catch(err => {
                promise.onError(err?.response?.data?.msg)
                throw new Error(err)
            })
        } catch (error) {
            setIsLoading(false)
            promise.onError('Server error')
        }
    }, [absensi, account, dispatch, userCoordinate])

    useEffect(() => {
        if (!status && absensi?.status === true && isUserWithinBounds(userCoordinate) && account) {
            if (isLoading) return
            // blankToast('Lokasi tercapai!')
            handleHadir()
            dispatch(setIsWatchPosition(false)) // disable watch position status if require
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[absensi, dispatch, handleHadir, status, userCoordinate])

    useEffect(() => {
        console.log('absensi', absensi)
        console.log('user status', status)
    },[absensi, status])

    if (!account || !absensi) return 

    // if (!showAbsence && (status !== null)) {
    //         if (proMode) return <div className={`flex flex-col gap-2 p-2 rounded`}>
    //         <div className='flex items-center rounded shadow text-neutral-500 overflow-auto w-full'>
    //             <div className={`flex flex-1 px-4 items-center py-2 gap-2 click-animation border-b-2 ${methodSelected === 'scan' ? 'border-secondary text-secondary bg-quaternary' : 'border-transparent'}`} onClick={() => setMethodSelected(prev => prev === 'scan' ? '' : 'scan')}>Pindai</div>
    //         </div>
    //         <div className={`${isLoading && 'opacity-50'}`}>
    //             {methodSelected === 'scan' && <AbsenceScan/>}
    //         </div>
    //     </div>
    //     return
    // }

    // if (proMode) return <div className={`flex flex-col gap-2 p-2 rounded ${!absensi?.status && 'hidden'}`}>
    //     <div className='flex items-center rounded shadow text-neutral-500 overflow-auto w-full'>
    //         <div className={`flex flex-1 px-4 items-center py-2 gap-2 click-animation border-b-2 ${methodSelected === 'gps' ? 'border-secondary text-secondary bg-quaternary' : 'border-transparent'}`} onClick={() => setMethodSelected('gps')}>Lokasi</div>
    //         <div className={`flex flex-1 px-4 items-center py-2 gap-2 click-animation border-b-2 ${methodSelected === 'form' ? 'border-secondary text-secondary bg-quaternary' : 'border-transparent'}`} onClick={() => setMethodSelected('form')}>Form</div>
    //         <div className={`flexspan flex-1 px-4 items-center py-2 gap-2 click-animation border-b-2 ${methodSelected === 'scan' ? 'border-secondary text-secondary bg-quaternary' : 'border-transparent'}`} onClick={() => setMethodSelected('scan')}>Pindai</div>
    //     </div>
    //     <div className={`${isLoading && 'opacity-50'}`}>
    //         {methodSelected === 'gps' && <AbsenceLocation/>}
    //         {methodSelected === 'form' && <AbsenceForm/>}
    //         {methodSelected === 'scan' && <AbsenceScan/>}
    //     </div>
    // </div>
    const methods = [
        { key: 'GPS Standar (Boosted)', title: 'GPS Standar (Boosted)', desc: 'Menggunakan titik lokasi saat ini tanpa pemantauan lanjutan', info: () => setShowCommonProblem(true) },
        { key: 'GPS Watch (Boosted)', title: 'GPS Watch (Boosted)', desc: 'Melacak dan memperbarui lokasi secara berkala hingga absen berhasil', info: () => setwatchInfo(true) },
        { key: 'Form Manual', title: 'Form Manual', desc: 'Absen tanpa GPS, menggunakan input formulir', info: () => setFormInfo(true) },
        // { key: 'Pindai Kode', title: 'Pindai Kode', desc: 'Gunakan kode QR atau pindai ID untuk membantu teman absen', info: () => setScanInfo(true) }
    ]    

    if (absensi?.status && status === null) return <div className="relative flex flex-1 flex-col shadow-md bg-transparent rounded-xl p-2">
        <div className="flex gap-2 items-center pb-2">
            <div className="flex flex-1 flex-col">
                <p className="flex-1 text-neutral-600">Kirim absen sekarang!</p>
                <span className="text-xs text-neutral-400">{methodSelected}</span>
            </div>
            <div className="flex shadow p-2 rounded gap-1 items-center click-animation bg-neutral-100 cursor-pointer" onClick={()=> setOpenListMethod(true)}>
                <FontAwesomeIcon className="text-xs w-4 h-4" icon={faArrowRightArrowLeft}/>
            </div>
        </div>
        {methodSelected === 'GPS Standar (Boosted)' && <AbsenceStandar/>}
        {methodSelected === 'GPS Watch (Boosted)' && <AbsenceWatch/>}
        {methodSelected === 'Form Manual' && <AbsenceForm/>}
        {/* <button className='flex flex-1 shadow-lg shadow-primary/50 items-center justify-center rounded text-neutral-100 px-2 click-animation bg-secondary min-h-[32px] mt-auto'>Absen dummy</button> */}
        <Modal onClose={() => setOpenListMethod(false)} zIndex={'z-[1001]'} isOpen={openListMethod} className='w-full flex flex-col gap-4 max-w-sm p-3'>
            <h1>Pilih model</h1>
            {methods.map((method) => (
                <div key={method.key} className="flex justify-between shadow rounded overflow-hidden">
                    <div 
                        className={`flex flex-1 flex-col p-2 ${
                            methodSelected === method.key ? 'bg-secondary text-neutral-200' : 'bg-neutral-300 text-neutral-600'
                        }`}
                        onClick={() => {
                            setMethodSelected(method.key);
                            setOpenListMethod(false);
                        }}
                    >
                        <p className="font-semibold">{method.title}</p>
                        <span className="text-xs opacity-75">{method.desc}</span>
                    </div>
                    <button className='flex items-center justify-center text-neutral-500 p-4 click-animation' onClick={method.info}>
                        <FontAwesomeIcon icon={faInfo}/>
                    </button>
                </div>
            ))}
        </Modal>
        <InfoCommonProblem isOpen={showCommonProblem} onClose={() => setShowCommonProblem(false)}/>
        <InfoAutoSubmit isOpen={watchInfo} onClose={() => setwatchInfo(false)}/>
        <InfoManualSubmit isOpen={formInfo} onClose={() => setFormInfo(false)}/>
        <InfoScanSubmit isOpen={scanInfo} onClose={() => setScanInfo(false)}/>
    </div>
    return null
}