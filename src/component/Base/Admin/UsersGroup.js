import { useEffect, useState } from "react"
import Modal from "../../utils/Modal"
import { API, formatTime, getCenterCoordinates, isUserWithinBounds } from "../../../utils"
import axios from "axios"

export default function UsersGroup({title, data, absenceData}) {
    
    return <div className='flex flex-col flex-1 shadow-md p-2 rounded-md overflow-hidden'>
        <p className="text-neutral-600 font-medium py-2 flex items-center justify-between">
            <span>{title}</span>
            <span>{data.length}</span>
        </p>
        <div className="flex flex-col items-center flex-1">
            {data.map(x => <UserGroupModel key={x._id} data={x} absenceData={absenceData}/>)}
            {!data.length && <p className="text-center m-auto">Kosong</p>}
        </div>
    </div>
}

function UserGroupModel({data, absenceData}) {
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [msg, setMsg] = useState('')

    function setUserInBounds() {
        setIsLoading(true)
        try {
            axios.put(API + '/absen/force/hadir/' + absenceData._id, {koordinat: getCenterCoordinates(absenceData?.coordinates), userId: data._id})
            .then(res => {
                if (res.data.success) {
                    setMsg('berhasil diperbarui')
                } else {
                    setMsg('something error')
                }
            })
        } catch (error) {
            setMsg('error, try again')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        console.log(data, absenceData);
    },[absenceData, data, isOpenModal])
    return <>
        <div className="odd:bg-neutral-200 p-2 rounded w-full cursor-pointer" onClick={() => setIsOpenModal(true)}>
            <p className="truncate text-neutral-600">{data.nama}<span>{data?.NIS && `#${data.NIS}`}</span></p>
        </div>
        <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)}>
            <p>{data.nama}{data?.NIS && `#${data.NIS}`} ({data.absen ? 'Absen' : 'Tidak absen'})</p>
            <AbsenceCell prop={'Kode'} value={data.kode}/>
            <AbsenceCell prop={'Keterangan'} value={data.keterangan}/>
            <AbsenceCell prop={'Lokasi'} value={isUserWithinBounds(data.koordinat, absenceData?.coordinates)? 'Di dalam area' : 'Di luar area'}/>
            <AbsenceCell prop={'Koordinat'} value={`${data?.koordinat ? data.koordinat[0] : 'defaultX'}, ${data?.koordinat ? data.koordinat[1] : 'defaultY'}`}/>
            <AbsenceCell prop={'Waktu Absen'} value={formatTime(data.waktuAbsen)}/>
            {isUserWithinBounds(data.koordinat, absenceData?.coordinates) ? '' : 
                isLoading ? <div className='flex gap-2 bg-primary shadow-lg shadow-primary/50 cursor-pointer items-center p-2 rounded text-neutral-200 click-animation'>Loading</div> :
                <div onClick={setUserInBounds} className='flex gap-2 bg-primary shadow-lg shadow-primary/50 cursor-pointer items-center p-2 rounded text-neutral-200 click-animation'>{msg ? msg : 'Ubah koordinat di dalam area'}</div>
            }
        </Modal>
    </>
}

function AbsenceCell({prop, value}) {
    return <div className='flex flex-col sm:flex-row border-b-[1px] border-solid border-neutral-300 last:border-transparent py-2'>
        <p className='sm:w-2/6 font-medium'>{prop}</p>
        <p>{value}</p>
    </div>
}