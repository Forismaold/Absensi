import { faQuestion, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useState } from 'react'
import {QrScanner} from "react-qrcode-scanner";
import { InfoScanSubmit } from '../InfoModals';
import { decryptObject, getCenterCoordinates, isUserWithinBounds } from '../../../../utils';
import { useSelector } from 'react-redux';
import { loadingToast } from '../../../utils/myToast';
import axios from '../../../utils/axios';
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
        <div className={`p-2 click-animation rounded shadow shadow-primary/50 text-center cursor-pointer ${turnOnOnCam ? 'text-primary' : 'text-neutral-100 bg-secondary' }`} onClick={() => {
            if (turnOnOnCam) return window.location.reload()
            setTurnOnOnCam(true)
        }}>{turnOnOnCam ? 'Matikan' : 'Nyalakan'} kamera</div>
        <div className='relative'>
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
        </div>
        <InfoScanSubmit isOpen={showInfo} onClose={() => setShowInfo(false)}/>
    </div>
}

function SubmitScan({qrAccount, setQrAccount}) {
    const absensi = useSelector(state => state.source.absensi)
    const account = useSelector(state => state.source.account)

    const [isLoading, setIsLoading] = useState(false)

    const handleHadir = useCallback(async () => {
        setIsLoading(true)
        const centerCoordinates = getCenterCoordinates(absensi?.coordinates)
        console.log(absensi?.coordinates, centerCoordinates);

        const dataToSend = {
            user: qrAccount._id,
            userCoordinate: centerCoordinates,
        }
        if (account.peran.includes('admin')) {
            const promise = loadingToast('Melakukan absensi sebagai admin')
            try {
                await axios.get( '/absen/hadir/' + absensi?._id, dataToSend)
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
        } else {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(async (position) => {
                        const promise = loadingToast('Mencari posisi...')
                        const { latitude, longitude } = position.coords
                        const value = [latitude, longitude]
                
                        if (!isUserWithinBounds(value)) {
                            promise.onError('Pemindai belum berada di area, pergi ke area dan coba lagi')
                            setIsLoading(false)
                            return
                        }
                        
                        promise.updateText('Mengirim absen teman')
                
                        try {
                            await axios.get( '/absen/hadir/' + absensi?._id, dataToSend)
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
        }
        
    }, [absensi?.coordinates, absensi?._id, qrAccount._id, account.peran, setQrAccount])

    return <div className='break-all flex flex-col gap-2 absolute inset-0'>
        <div className='flex flex-col gap-2 shadow-lg shadow-primary/50 p-2 rounded-md text-center justify-center items-center h-full bg-neutral-200 z-[100]'>
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
                        Kirim dan selanjutnya
                    </div>
                }
            </div>
        </div>
    </div>
}