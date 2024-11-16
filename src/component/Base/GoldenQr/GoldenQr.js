import { faQuestion, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useState } from "react";
import { QrScanner } from "react-qrcode-scanner";
import { API, decryptObject } from "../../../utils";
import LoadingIcon from "../../utils/LoadingIcon";
import axios from "axios";
import { loadingToast } from "../../utils/myToast";
import { useSelector } from "react-redux";
import { InfoGoldenQr } from "../Absen/InfoModals";

export default function GoldenQr() {
    const [absence, setAbsence] = useState(null)
    const [showInfo, setShowInfo] = useState(false)
    const [turnOnOnCam, setTurnOnOnCam] = useState(false)
    const [flipHorizontally, setFlipHorizontally] = useState(true)

    return <div className="flex flex-col gap-2 rounded-xl">
        <div className='flex gap-2 items-center justify-between'>
            <p>Pindai Golden QR</p>
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
                            console.log("scan detected", decryptObject(value))
                            setAbsence(decryptObject(value))
                        }}
                        flipHorizontally={flipHorizontally}
                    />
                    <span className='click-animation text-primary text-xs p-2 underline' onClick={() => setFlipHorizontally(prev => !prev)}>Balikkan horizontal</span>
                </>
            }
            {absence && <SubmitScan setAbsensi={(value) => setAbsence(value)} absensi={absence}/>}
        </div>
        <InfoGoldenQr isOpen={showInfo} onClose={() => setShowInfo(false)}/>
    </div>
}

function SubmitScan({absensi, setAbsensi}) {
    const account = useSelector(state => state.source.account)
    const [isLoading, setIsLoading] = useState(false)

    const handleHadir = useCallback(async () => {
        setIsLoading(true)

        const dataToSend = {
            user: account._id,
            userCoordinate: absensi?.centerCoordinates,
        }
        const promise = loadingToast('Mengirim absen dengan Golden QR...')
        try {
            await axios.post(API + '/absen/hadir/' + absensi?.id, dataToSend)
            .then(res => {
                promise.onSuccess(res?.data?.msg)
                setAbsensi(null)
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
    }, [account._id, absensi?.centerCoordinates, absensi?.id, setAbsensi])

    return <div className='break-all flex flex-col gap-2 absolute inset-0'>
        <div className='flex flex-col gap-2 shadow-lg shadow-primary/50 p-2 rounded-md text-center justify-center items-center h-full bg-neutral-200 z-[100]'>
            <div className='flex flex-col'>
                <p>{absensi?.title}</p>
            </div>
            <div className='flex gap-2'>
                <div className='flex gap-2 items-center p-2 click-animation rounded-lg cursor-pointer border border-solid border-primary text-primary' onClick={() => setAbsensi(null)}>
                    <FontAwesomeIcon icon={faTrash}/>
                </div>
                {isLoading ? 
                    <div className='flex flex-1 gap-2 items-center bg-secondary p-2 px-4 shadow-lg shadow-primary/50 click-animation rounded-lg text-neutral-100 cursor-pointer'>
                        <LoadingIcon/>
                    </div>
                    :
                    <div className='flex flex-1 gap-2 items-center bg-secondary p-2 px-4 shadow-lg shadow-primary/50 click-animation rounded-lg text-neutral-100 cursor-pointer' onClick={handleHadir}>
                        Kirim absen
                    </div>
                }
            </div>
        </div>
    </div>
}