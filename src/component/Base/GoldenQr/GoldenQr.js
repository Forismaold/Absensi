import { faQuestion, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useState } from "react";
import { QrScanner } from "react-qrcode-scanner";
import { API, decryptObject, formatBeautyDate } from "../../../utils";
import LoadingIcon from "../../utils/LoadingIcon";
import axios from "axios";
import { loadingToast } from "../../utils/myToast";
import { useDispatch, useSelector } from "react-redux";
import { InfoGoldenQr } from "../Absen/InfoModals";
import CheckAccountExist from "../../utils/CheckAccountExist";
import { useNavigate } from "react-router-dom";
import { setAbsensi } from "../../../redux/source";

export default function GoldenQr() {
    const account = useSelector(state => state.source.account)
    const [absence, setAbsence] = useState(null)
    // const [absence, setAbsence] = useState({
    //     "id": "6792704ff646461a4e8b1248",
    //     "title": "soundcoree",
    //     "openedBy": "Gary",
    //     "date": "2025-01-23T16:37:45.496Z",
    //     "centerCoordinates": [
    //         -7.482127219338983,
    //         110.2221420478633
    //     ]
    // })
    const [showInfo, setShowInfo] = useState(false)
    const [turnOnOnCam, setTurnOnOnCam] = useState(false)
    const [flipHorizontally, setFlipHorizontally] = useState(true)

    return <div className="flex flex-col gap-2 rounded-xl">
        <CheckAccountExist/>
        <div className='flex gap-2 items-center justify-between'>
            <p>Pindai Golden QR (Baru!)</p>
            <button className='flex items-center justify-center px-3 text-neutral-500 p-2 click-animation' onClick={() => setShowInfo(true)}><FontAwesomeIcon icon={faQuestion}/></button>
        </div>
        {account ?
            <>
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
                    {absence && <SubmitScan setParentAbsensi={(value) => setAbsence(value)} absensi={absence}/>}
                </div>
            </>
        :
            <div className={`p-2 rounded shadow shadow-primary/50 text-center cursor-pointer text-primary`}>Silahkan masuk ke akun anda atau daftar sebelum menggunakan fitur golden QR</div>
        }
        <InfoGoldenQr isOpen={showInfo} onClose={() => setShowInfo(false)}/>
    </div>
}

function SubmitScan({absensi, setParentAbsensi}) {
    const account = useSelector(state => state.source.account)
    const [isLoading, setIsLoading] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleHadir = useCallback(async () => {
        setIsLoading(true)

        const dataToSend = {
            user: account?._id,
            koordinat: absensi?.centerCoordinates,
        }
        const promise = loadingToast('Mengirim absen dengan Golden QR...')
        try {
            await axios.put(API + '/absen/force/hadir/' + absensi?.id, dataToSend)
            .then(res => {
                promise.onSuccess("terimakasih sudah absen sobat", 30000)
                setParentAbsensi(null)
                setIsLoading(false)
                dispatch(setAbsensi(res.data))
                navigate('/absen/' + res.data?.data?._id)
                console.log("response", res.data)
            }).catch(err => {
                console.log(err)
                promise.onError(err?.response?.data?.msg || 'Pastikan absensi sudah ada dan terbuka')
                throw new Error(err)
            })
        } catch (error) {
            setIsLoading(false)
            console.log('your error', error)
        }
    }, [account, absensi, setParentAbsensi, dispatch, navigate])

    return <div className='break-all flex flex-col gap-2 absolute inset-0'>
        <div className='flex flex-col gap-2 shadow-lg shadow-primary/50 p-2 rounded-md text-center justify-center items-center h-full bg-neutral-200 z-[100]'>
            <div className='flex flex-col gap-2 p-2 items-center'>
                <div className="flex gap-2 items-center">
                    <p className='text-xl font-semibold'>{absensi.title}</p>
                    <span className='text-sm font-normal'>oleh</span>
                    <div className='text-sm font-normal w-16 truncate'>{`${absensi.openedBy+absensi.openedBy+absensi.openedBy}`}</div>
                </div>
                <p>{formatBeautyDate(absensi?.date)}</p>
            </div>
            <div className='flex gap-2'>
                <div className='flex gap-2 items-center p-2 click-animation rounded-lg cursor-pointer border border-solid border-primary text-primary' onClick={() => setParentAbsensi(null)}>
                    <FontAwesomeIcon icon={faXmark}/>
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