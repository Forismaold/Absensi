import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useState } from 'react'
import {QrScanner} from "react-qrcode-scanner";
import { InfoScanSubmit } from '../InfoModals';
import { API, decryptObject, isUserWithinBounds } from '../../../../utils';
import { useSelector } from 'react-redux';
import { blankToast, loadingToast } from '../../../utils/myToast';
import axios from 'axios';


export default function AbsenceScan() {
    const userCoordinate = useSelector(state => state.coordinates.user)
    const absensi = useSelector(state => state.source.absensi)

    const [read, setRead] = useState('')
    const [turnOnOnCam, setTurnOnOnCam] = useState(false)
    const [showInfo, setShowInfo] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleHadir = useCallback(async () => {
        const qrAccount = decryptObject(read)

        const dataToSend = {
            _id: qrAccount._id,
            userCoordinate: userCoordinate ? userCoordinate : [0,0],
            nama: qrAccount.nama,
            kelas: qrAccount.kelas,
            nomorKelas: qrAccount.nomorKelas,
            nomorAbsen: qrAccount.nomorAbsen,
            status: qrAccount.status
        }

        const promise = loadingToast('Mengirim...')
        setIsLoading(true)

        if (!isUserWithinBounds(userCoordinate)) return blankToast('Kamu berada diluar area, harap pergi ke area')

        try {
            await axios.post(API + '/absen/hadir/' + absensi?._id, dataToSend)
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
    }, [read, userCoordinate, absensi])

    return <div className="flex flex-col gap-2 shadow rounded-xl">
        <div className='flex gap-2 items-center justify-between'>
            <p>Kirim absen sebagai teman</p>
            <button className='flex items-center justify-center px-3 text-neutral-500 p-2 click-animation' onClick={() => setShowInfo(true)}><FontAwesomeIcon icon={faQuestion}/></button>
        </div>
        <div className={`p-2 click-animation rounded shadow shadow-primary/50 text-center ${turnOnOnCam ? 'text-primary' : 'text-neutral-100 bg-secondary' }`} onClick={() => {
            if (turnOnOnCam) return window.location.reload()
            setTurnOnOnCam(true)
        }}>{turnOnOnCam ? 'Matikan' : 'Nyalakan'} kamera</div>
        {turnOnOnCam && <QrScanner onScan={value => {
            setRead(value)
            console.log(decryptObject(value))
        }}/>}
        {turnOnOnCam &&
            <div className='flex flex-col gap-2'>
                <input type="text" className='p-2 rounded shadow w-full' readOnly value={read} placeholder='Menunggu pemindai' autoComplete='off'/>
            </div>
        }
        {read && <div onClick={handleHadir}>Isi: {read}</div>}
        {isLoading && <div>Mengirim...</div>}
        <InfoScanSubmit isOpen={showInfo} onClose={() => setShowInfo(false)}/>
    </div>
}