import { useState } from "react"
import Modal from "../../utils/Modal"
import { formatTime, isUserWithinBounds } from "../../../utils"

export default function UsersGroup({title, data}) {
    return <div className='flex flex-col flex-1 shadow-md p-2 rounded-md overflow-hidden'>
        <p className="text-neutral-600 font-medium py-2 flex items-center justify-between">
            <span>{title}</span>
            <span>{data.length}</span>
        </p>
        <div className="flex flex-col items-center flex-1">
            {data.map(x => <UserGroupModel key={x._id} data={x}/>)}
            {!data.length && <p className="text-center m-auto">Kosong</p>}
        </div>
    </div>
}

function UserGroupModel({data}) {
    const [isOpenModal, setIsOpenModal] = useState(false)
    return <>
        <div className="odd:bg-neutral-200 p-2 rounded w-full cursor-pointer" onClick={() => setIsOpenModal(true)}>
            <p className="truncate text-neutral-600">{data.nama}<span>{data?.NIS && `#${data.NIS}`}</span></p>
        </div>
        <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)}>
            <p>{data.nama}{data?.NIS && `#${data.NIS}`} ({data.absen ? 'Absen' : 'Tidak absen'})</p>
            <AbsenceCell prop={'Kode'} value={data.kode}/>
            <AbsenceCell prop={'Keterangan'} value={data.keterangan}/>
            <AbsenceCell prop={'Lokasi'} value={isUserWithinBounds(data.koordinat)? 'Di dalam area' : 'Di luar area'}/>
            <AbsenceCell prop={'Koordinat'} value={`${data.koordinat[0]}, ${data.koordinat[1]}`}/>
            <AbsenceCell prop={'Waktu Absen'} value={formatTime(data.waktuAbsen)}/>
        </Modal>
    </>
}

function AbsenceCell({prop, value}) {
    return <div className='flex flex-col sm:flex-row border-b-[1px] border-solid border-neutral-300 last:border-transparent py-2'>
        <p className='sm:w-2/6 font-medium'>{prop}</p>
        <p>{value}</p>
    </div>
}