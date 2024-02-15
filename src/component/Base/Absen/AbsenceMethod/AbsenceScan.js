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
    const isWatchPosition = useSelector(state => state.source.isWatchPosition)

    const [qrAccount, setQrAccount] = useState('')
    const [turnOnOnCam, setTurnOnOnCam] = useState(false)
    const [showInfo, setShowInfo] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [flipHorizontally, setFlipHorizontally] = useState(false)

    const handleHadir = useCallback(async () => {
        const dataToSend = {
            _id: qrAccount._id,
            userCoordinate: userCoordinate ? userCoordinate : [0,0],
            nama: qrAccount.nama,
            kelas: qrAccount.kelas,
            nomorKelas: qrAccount.nomorKelas,
            nomorAbsen: qrAccount.nomorAbsen,
        }

        if (!isWatchPosition) return blankToast('Harap mulai Gps')

        if (!isUserWithinBounds(userCoordinate)) return blankToast('Pemindai berada diluar area, harap pergi ke area')

        setIsLoading(true)
        

        const promise = loadingToast('Mengirim absen teman...')

        try {
            await axios.post(API + '/absen/hadir/' + absensi?._id, dataToSend)
            .then(res => {
                promise.onSuccess(res.data.msg)
                setQrAccount('')
                setIsLoading(false)
            }).catch(err => {
                promise.onError(err.response.data.msg)
                throw new Error(err)
            })
        } catch (error) {
            setIsLoading(false)
            promise.onError('Server error')
        }
    }, [qrAccount, userCoordinate, isWatchPosition, absensi])

    return <div className="flex flex-col gap-2 shadow rounded-xl">
        <div className='flex gap-2 items-center justify-between'>
            <p>Kirim absen sebagai teman</p>
            <button className='flex items-center justify-center px-3 text-neutral-500 p-2 click-animation' onClick={() => setShowInfo(true)}><FontAwesomeIcon icon={faQuestion}/></button>
        </div>
        <div className={`p-2 click-animation rounded shadow shadow-primary/50 text-center ${turnOnOnCam ? 'text-primary' : 'text-neutral-100 bg-secondary' }`} onClick={() => {
            if (turnOnOnCam) return window.location.reload()
            setTurnOnOnCam(true)
        }}>{turnOnOnCam ? 'Matikan' : 'Nyalakan'} kamera</div>
        {turnOnOnCam && 
            <>
                <QrScanner onScan={value => {
                        const [_id, nama, kelas, nomorKelas, nomorAbsen] = decryptObject(value)
                        setQrAccount({_id, nama, kelas, nomorKelas, nomorAbsen})
                    }}
                    flipHorizontally={flipHorizontally}
                />
                <span className='click-animation text-primary text-xs p-2 underline' onClick={() => setFlipHorizontally(prev => !prev)}>Balikkan horizontal</span>
            </>
        }
        {qrAccount && <div className='break-all flex flex-col gap-2'>
            <div className='shadow p-2 rounded text-center' onClick={handleHadir}>
                <p>{qrAccount.nama}</p>
                <p>{qrAccount.kelas}/{qrAccount.nomorAbsen}</p>
            </div>
            <div className='bg-neutral-200 text-neutral-500 shadow p-2 rounded' onClick={() => setQrAccount(null)}>
                Setel ulang
            </div>
        </div>}
        {isLoading && <div>Mengirim...</div>}
        <InfoScanSubmit isOpen={showInfo} onClose={() => setShowInfo(false)}/>
    </div>
}