import { useCallback, useEffect, useState } from "react";
import AbsenceForm from "./AbsenceForm";
import AbsenceLocation from "./AbsenceLocation";
import { API, isUserWithinBounds } from "../../../../utils";
import { useDispatch, useSelector } from "react-redux";
import { blankToast, loadingToast } from "../../../utils/myToast";
import axios from "axios";
import { setAbsensi, setIsWatchPosition, setShowAbsence, setShowMap } from "../../../../redux/source";
import AbsenceScan from "./AbsenceScan";
import AbsenceQrCode from "./AbsenceQrCode";

export default function AbsenceMethod() {
    const account = useSelector(state => state.source.account)
    const userCoordinate = useSelector(state => state.coordinates.user)
    const absensi = useSelector(state => state.source.absensi)
    const status = useSelector(state => state.source.status)
    const showAbsence = useSelector(state => state.source.showAbsence)

    const [isLoading, setIsLoading] = useState(false)
    const [methodSelected, setMethodSelected] = useState('gps')

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
            await axios.post(API + '/absen/hadir/' + absensi?._id, dataToSend)
            .then(res => {
                promise.onSuccess(res?.data?.msg)
                dispatch(setShowAbsence(false))
                dispatch(setShowMap(false))
                dispatch(setAbsensi(res?.data?.data))
                console.log(res?.data);
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
            blankToast('Lokasi tercapai!')
            handleHadir()
            dispatch(setIsWatchPosition(false))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[absensi, dispatch, handleHadir, status, userCoordinate])

    if (!account || !absensi) return

    if (!showAbsence && (status !== null)) return


    return <div className="bg-neutral-200 flex flex-col gap-2 p-2 rounded">
        <div className='flex items-center rounded shadow text-neutral-500 overflow-auto w-full'>
            <div className={`flex flex-1 px-4 items-center py-2 gap-2 click-animation border-b-2 ${methodSelected === 'gps' ? 'border-secondary text-secondary bg-quaternary' : 'border-transparent'}`} onClick={() => setMethodSelected('gps')}>Lokasi</div>
            <div className={`flex flex-1 px-4 items-center py-2 gap-2 click-animation border-b-2 ${methodSelected === 'form' ? 'border-secondary text-secondary bg-quaternary' : 'border-transparent'}`} onClick={() => setMethodSelected('form')}>Form</div>
            <div className={`flex flex-1 px-4 items-center py-2 gap-2 click-animation border-b-2 ${methodSelected === 'scan' ? 'border-secondary text-secondary bg-quaternary' : 'border-transparent'}`} onClick={() => setMethodSelected('scan')}>Pindai</div>
            <div className={`flex flex-1 px-4 items-center py-2 gap-2 click-animation border-b-2 ${methodSelected === 'qrcode' ? 'border-secondary text-secondary bg-quaternary' : 'border-transparent'}`} onClick={() => setMethodSelected('qrcode')}>kode</div>
        </div>
        <div className={`${isLoading && 'opacity-50'}`}>
            {methodSelected === 'gps' && <AbsenceLocation/>}
            {methodSelected === 'form' && <AbsenceForm/>}
            {methodSelected === 'scan' && <AbsenceScan/>}
            {methodSelected === 'qrcode' && <AbsenceQrCode/>}
        </div>
    </div>
}