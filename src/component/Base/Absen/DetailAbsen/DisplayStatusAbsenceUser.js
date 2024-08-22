import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCheckDouble, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { formatTime, isUserWithinBounds } from "../../../../utils"
import { toggleShowAbsence } from '../../../../redux/source'
import Modal from '../../../utils/Modal'

export default function DisplayStatusAbsenceUser() {    
    const account = useSelector(state => state.source.account)
    const showAbsence = useSelector(state => state.source.showAbsence)
    const status = useSelector(state => state.source.status)
    const [showAbsenceDetail, setShowAbsenceDetail] = useState(false)

    const dispatch = useDispatch()

    useEffect(() => {
        if (status?.absen === true || status?.absen === false) setShowAbsenceDetail(true)
    },[status])

    if (!status|| !account) return null

    return <>    
    <div className='bg-secondary shadow-lg shadow-primary/50 text-neutral-100 rounded p-4 flex gap-2 items-center relative click-animation cursor-pointer' onClick={() => setShowAbsenceDetail(true)}>
        {status?.absen === true &&
            <div className='flex gap-2 items-center w-full'>
                <FontAwesomeIcon icon={isUserWithinBounds(status?.koordinat) ? faCheckDouble : faCheck}/>
                <p>{isUserWithinBounds(status?.koordinat) ? 'Absen di area' : 'Absen diluar area'}</p>
                <span className='ml-auto'>{formatTime(status.waktuAbsen)}</span>
            </div>
        }
        {status?.absen === false &&
            <div className='flex flex-col w-full'>
                <div className='flex items-center gap-2'>
                    <FontAwesomeIcon icon={faXmark}/>
                    <p>Tidak Absen</p>
                </div>
            </div>
        }
    </div>
    {status?.absen !== null && account && <span onClick={() => dispatch(toggleShowAbsence())} className='click-animation text-primary text-right underline cursor-pointe'>{showAbsence ? 'Batal perbarui' : 'Perbarui absensi'}</span>}
    <DetailUserAbsence isOpen={showAbsenceDetail} onClose={() => setShowAbsenceDetail(false)} status={status}/>
    </>
}

function DetailUserAbsence({isOpen, onClose, status}) {
    return <Modal isOpen={isOpen} onClose={onClose} zIndex={'z-[1001]'}>
        <div className='flex gap-2 items-center p-2'>
            <FontAwesomeIcon icon={isUserWithinBounds(status?.koordinat) ? faCheckDouble : faCheck} className='p-2'/>
            <div className='flex flex-col'>
                <p>{status.user.nama}</p>
                <p>{status.user?.kelas}{status.user?.nomorKelas}/{status.user?.nomorAbsen}</p>
            </div>
        </div>
        <div className='flex flex-col gap-2 bg-secondary shadow-lg shadow-primary/50 text-neutral-100 p-2 rounded'>
            {status?.absen === true &&
            <div className='flex flex-col w-full gap-2'>
                <div className='flex flex-col'>
                    <AbsenceCell prop={'Koordinat'} value={`${status?.koordinat[0] || 0}, ${status?.koordinat[1] || 0}`}/>
                    <AbsenceCell prop={'Keterangan'} value={isUserWithinBounds(status?.koordinat) ? 'Absen di area' : 'Absen diluar area'}/>
                    <AbsenceCell prop={'Waktu Absen'} value={formatTime(status.waktuAbsen)}/>
                </div>
            </div>
            }
            {status?.absen === false &&
            <div className='flex flex-col w-full'>
                <div className='flex items-center gap-2'>
                    <FontAwesomeIcon icon={faXmark}/>
                    <p>Tidak Absen</p>
                </div>
                <div className='flex flex-col'>
                    <AbsenceCell prop={'Kode'} value={status.kode}/>
                    <AbsenceCell prop={'Keterangan'} value={status.keterangan}/>
                    <AbsenceCell prop={'Waktu Absen'} value={formatTime(status.waktuAbsen)}/>
                </div>
            </div>
            }
        </div>
    </Modal>
}

function AbsenceCell({prop, value}) {
    return <div className='flex flex-col sm:flex-row border-b-[1px] border-solid border-neutral-300 last:border-transparent py-2'>
        <p className='sm:w-2/6 font-medium'>{prop}</p>
        <p>{value}</p>
    </div>
}