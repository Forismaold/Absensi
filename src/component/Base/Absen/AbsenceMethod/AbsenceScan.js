import { faQuestion, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useState } from 'react'
import {QrScanner} from "react-qrcode-scanner";
import { InfoScanSubmit } from '../InfoModals';
import { API, decryptObject, getCenterCoordinates, isUserWithinBounds } from '../../../../utils';
import { useSelector } from 'react-redux';
import { loadingToast } from '../../../utils/myToast';
import axios from 'axios';
import LoadingIcon from '../../../utils/LoadingIcon';


export default function AbsenceScan() {
    const [qrAccount, setQrAccount] = useState(null)
    const [turnOnOnCam, setTurnOnOnCam] = useState(false)
    const [showInfo, setShowInfo] = useState(false)
    const [flipHorizontally, setFlipHorizontally] = useState(true)

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
                        console.log(decryptObject(value))
                        setQrAccount({_id, nama, kelas, nomorKelas, nomorAbsen})
                    }}
                    flipHorizontally={flipHorizontally}
                />
                <span className='click-animation text-primary text-xs p-2 underline' onClick={() => setFlipHorizontally(prev => !prev)}>Balikkan horizontal</span>
            </>
        }
        {qrAccount && <SubmitScan setQrAccount={(value) => setQrAccount(value)} qrAccount={qrAccount}/>}
        <InfoScanSubmit isOpen={showInfo} onClose={() => setShowInfo(false)} setQrAccount={value => setQrAccount(value)}/>
    </div>
}

function SubmitScan({qrAccount, setQrAccount}) {
    const absensi = useSelector(state => state.source.absensi)
    

    const [isLoading, setIsLoading] = useState(false)

    const handleHadir = useCallback(async () => {
        if (navigator.geolocation) {
            setIsLoading(true)
            navigator.geolocation.getCurrentPosition(async (position) => {
                    const promise = loadingToast('Mencari posisi...')
                    const { latitude, longitude } = position.coords
                    const value = [latitude, longitude]
                    const centerCoordinates = getCenterCoordinates(absensi?.coordinates)
                    console.log(absensi?.coordinates, centerCoordinates);

                    const dataToSend = {
                        user: qrAccount._id,
                        userCoordinate: centerCoordinates,
                    }
            
                    if (!isUserWithinBounds(value)) {
                        promise.onError('Pemindai belum berada di area, pergi ke area dan coba lagi')
                        setIsLoading(false)
                        return
                    }
                    
                    promise.updateText('Mengirim absen teman')
            
                    try {
                        await axios.post(API + '/absen/hadir/' + absensi?._id, dataToSend)
                        .then(res => {
                            promise.onSuccess(res?.data?.msg)
                            setQrAccount(null)
                            setIsLoading(false)
                        }).catch(err => {
                            console.log(err)
                            promise.onError(err?.response?.data?.msg)
                            throw new Error(err)
                        })
                    } catch (error) {
                        setIsLoading(false)
                        console.log(error)
                        promise.onError('Server error')
                    }
                },
                (error) => {
                    console.error('Error getting location:', error)
                    setIsLoading(false)
                },
                {
                    enableHighAccuracy: true,
                    maximumAge: 0,
                }
            )
        } else {
            alert('Geolocation tidak didukung browsermu.')
            setIsLoading(false)
        }
        
    }, [qrAccount, absensi, setQrAccount])

    useEffect(() => {
      console.log('absensi',absensi);
    
      return () => {
        
      }
    }, [absensi])
    

    return <div className='break-all flex flex-col gap-2'>
        <div className='flex flex-col gap-2 shadow-lg shadow-primary/50 p-2 rounded-md text-center'>
            <div className='flex flex-col'>
                <p>{qrAccount.nama}</p>
                <p>{qrAccount.kelas}{qrAccount.nomorKelas}/{qrAccount.nomorAbsen}</p>
            </div>
            <div className='flex gap-2'>
                <div className='flex gap-2 items-center p-2 click-animation rounded-lg cursor-pointer border border-solid border-primary text-primary' onClick={() => setQrAccount(null)}>
                    <FontAwesomeIcon icon={faTrash}/>
                </div>
                {isLoading ? 
                    <div className='flex flex-1 gap-2 items-center bg-secondary p-2 px-4 shadow-lg shadow-primary/50 click-animation rounded-lg text-neutral-100 cursor-pointer'>
                        <LoadingIcon/>
                    </div>
                    :
                    <div className='flex flex-1 gap-2 items-center bg-secondary p-2 px-4 shadow-lg shadow-primary/50 click-animation rounded-lg text-neutral-100 cursor-pointer' onClick={handleHadir}>
                        Kirimkan
                    </div>
                }
            </div>
        </div>
    </div>
}