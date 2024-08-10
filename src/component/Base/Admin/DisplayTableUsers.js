import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import { API, formatTime, getCenterCoordinates, isUserWithinBounds } from "../../../utils"
import Modal from "../../utils/Modal"

const classList = [
    {classNumberRank: 'X.E', classCount: 9},
    {classNumberRank: 'XI.F', classCount: 9},
    {classNumberRank: 'XII.F', classCount: 8}
]

export default function DisplayTableUsers({usersTicket, absensi}) {
    const [tickets, setTickets] = useState(null)
    const [users, setUsers] = useState(null)
    const [selectedClass, setSelectedClass] = useState(null)
    const [isFetch, setIsFetch] = useState(false)

    function changeSelectedClass(item) {
        if (isFetch) {
            setUsers(null)
            return
        }
        setSelectedClass(item)
    }

    const fetchData = useCallback(async() => {
        if (!selectedClass) return
        setIsFetch(true)
        try {
            await axios.get(API + `/users/class/${selectedClass?.split('-')?.join('/') || ''}`)
            .then(res => {
                const userSorted = res.data.sort((a,b) => a.nomorAbsen - b.nomorAbsen)
                setUsers(userSorted)
                setIsFetch(false)
            }).catch(err => {
                setIsFetch(false)
                throw new Error(err)
            })
        } catch (error) {
            setIsFetch(false)
        }
    }, [selectedClass])

    useEffect(() => {
        fetchData()
    }, [fetchData, selectedClass])

    useEffect(() => {
        console.log(usersTicket)
        setTickets(usersTicket)
    }, [usersTicket])
    
    

    return <div className="flex flex-col gap-2">
        <div className="flex flex-wrap">
            <div className={`p-2 cursor-pointer click-animation border-b-2 ${!selectedClass && 'border-secondary text-secondary bg-quaternary'}`} onClick={()=>changeSelectedClass(null)}>null</div>
            {classList.map((item, i) => Array.from({ length: item.classCount }, (_, index) => (
                    <div key={index + 1} className={`p-2 cursor-pointer click-animation border-b-2 ${selectedClass === `${item.classNumberRank}-${index + 1}` && 'border-secondary text-secondary bg-quaternary'} ${isFetch && 'opacity-95'}`} onClick={()=>changeSelectedClass(`${item.classNumberRank}-${index + 1}`)}>{item.classNumberRank}-{index + 1}</div>
                ))
            )}
        </div>
        <div>
            {!selectedClass && <p className="p-4 mx-auto">Silahkan pilih kelas!</p>}
            {users?.map((data) => <UserRowModel data={data} key={data._id} tickets={tickets} absensiData={absensi}/>) || []}
        </div>
    </div>
}

function UserRowModel({data, tickets, absensiData}) {
    const [absensi, ] = useState(absensiData)
    const [ticket, setTicket] = useState(null)
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [msg, setMsg] = useState('')

    function setUserInBounds() {
        setIsLoading(true)
        try {
            axios.put(API + '/absen/force/hadir/' + absensi._id, {koordinat: getCenterCoordinates(absensi?.coordinates), user: data._id})
            .then(res => {
                if (res.data.success) {
                    setMsg('berhasil diperbarui')
                    setTicket(res.data.ticket)
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
        let userExist = tickets?.find(ticket => ticket.user._id === data._id)
        if (userExist) {
            setTicket(userExist)
            console.log(userExist, data)
        }
    },[absensi, data, ticket, tickets])

    return <>
        <div className={`p-2 rounded w-full cursor-pointer ${ticket ? 'bg-tertiary' : 'odd:bg-neutral-200'}`} onClick={() => setIsOpenModal(true)}>
            <p className="truncate text-neutral-600">{data.nomorAbsen} {data.nama}<span>{data?.NIS && `#${data.NIS}`}</span></p>
        </div>
        <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)} zIndex={'z-[2]'}>
            <p>{data.nama}{data?.NIS && `#${data.NIS}`} ({ticket?.absen ? 'Absen' : 'Tidak absen'})</p>
            <AbsenceCell prop={'Kode'} value={ticket?.kode}/>
            <AbsenceCell prop={'Keterangan'} value={ticket?.keterangan}/>
            <AbsenceCell prop={'Lokasi'} value={isUserWithinBounds(ticket?.koordinat || [0,0], absensi?.coordinates)? 'Di dalam area' : 'Di luar area'}/>
            <AbsenceCell prop={'Koordinat'} value={`${ticket?.koordinat ? ticket.koordinat[0] : 'defaultX'}, ${ticket?.koordinat ? ticket.koordinat[1] : 'defaultY'}`}/>
            <AbsenceCell prop={'Waktu Absen'} value={formatTime(ticket?.waktuAbsen)}/>
            {isUserWithinBounds(ticket?.koordinat || [0,0], absensi?.coordinates) ? '' : 
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